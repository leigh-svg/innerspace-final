import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req) {
  try {
    const payload = await req.json();
    const { projectId, dimensions, openings, lidarMetadata, videoPath } = payload;

    // 2. Perform Spatial Calculations (Bill of Quantities Logic)
    let rawFloorAreaMM2 = 0; 
    const mockLength = 5000; // 5m
    const mockWidth = 4000;  // 4m
    rawFloorAreaMM2 = mockLength * mockWidth; 
    
    const floorAreaM2 = rawFloorAreaMM2 / 1000000; // Convert mm^2 to m^2
    const perimeterMM = (mockLength + mockWidth) * 2;
    
    const wallAreaGrossM2 = (perimeterMM * dimensions.ceilingHeight) / 1000000;

    // Subtract openings for Net Wall Area
    let openingAreaM2 = 0;
    openings.forEach(op => {
      openingAreaM2 += (op.width * op.height) / 1000000;
    });

    const wallAreaNetM2 = Math.max(0, wallAreaGrossM2 - openingAreaM2);

    // 3. Optional: Trigger GDPR Cold-Storage/Deletion for Video
    if (videoPath) {
       // Schedule a background queue worker...
    }

    // 4. Save to Database
    const { data, error } = await supabase
      .from('spatial_scans')
      .insert({
        project_id: projectId,
        dimensions: dimensions,
        lidar_metadata: lidarMetadata,
        floor_area: floorAreaM2,
        wall_area_gross: wallAreaGrossM2,
        wall_area_net: wallAreaNetM2,
        video_path: videoPath
      })
      .select()
      .single();

    if (error) throw error;

    // 5. Update Project Status
    const { error: projectError } = await supabase
      .from('projects')
      .update({ status: 'Designing' })
      .eq('project_id', projectId);

    if (projectError) throw projectError;

    return NextResponse.json({
      success: true,
      message: 'Spatial data ingested. BoQ calculated.',
      boq: {
        floorAreaSqM: floorAreaM2,
        paintableWallAreaSqM: wallAreaNetM2,
        estimatedPaintLiters: Number((wallAreaNetM2 / 12).toFixed(2))
      },
      scanRecord: data
    });

  } catch (error) {
    console.error('Scan Ingestion Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
