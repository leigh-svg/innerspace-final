import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Validates if adding a new item exceeds the user's budget cap.
 * Used during the AI 'Unified Basket' Population phase.
 */
export async function validateBudgetAddition(
  userId: string, 
  projectId: string, 
  newItemPrice: number
): Promise<{ 
  isApproved: boolean; 
  currentTotal: number; 
  budgetCap: number;
  remaining: number;
  message?: string 
}> {
  
  // 1. Fetch User Profile for Budget Cap
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('budget_cap')
    .eq('user_id', userId)
    .single();

  if (profileErr || !profile) throw new Error('User profile or budget not found.');
  const budgetCap = Number(profile.budget_cap);

  // 2. Aggregate current Basket Total for the specific project
  const { data: basketItems, error: basketErr } = await supabase
    .from('project_items')
    .select('quantity, products!inner(retail_price)')
    .eq('project_id', projectId)
    .in('status', ['Suggested', 'Approved', 'Ordered']);

  if (basketErr) throw new Error('Failed to fetch current basket.');

  // Calculate current total
  const currentTotal = basketItems.reduce((acc, item: any) => {
    return acc + (item.quantity * item.products.retail_price);
  }, 0);

  // 3. Validation Logic
  const projectedTotal = currentTotal + newItemPrice;
  const remaining = budgetCap - projectedTotal;

  if (projectedTotal > budgetCap) {
    return {
      isApproved: false,
      currentTotal,
      budgetCap,
      remaining: budgetCap - currentTotal,
      message: `Adding this item exceeds the budget cap by $${Math.abs(remaining).toFixed(2)}.`
    };
  }

  return {
    isApproved: true,
    currentTotal: projectedTotal,
    budgetCap,
    remaining,
    message: 'Item fits within defined financial guardrails.'
  };
}
