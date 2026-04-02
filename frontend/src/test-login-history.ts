/**
 * Test script for login history feature
 * This demonstrates how to use the login history service
 */

import { loginHistoryService } from './lib/loginHistoryService';

// Example 1: Save a successful login
async function testSuccessfulLogin() {
  console.log('Testing successful login save...');
  
  const loginId = await loginHistoryService.saveLoginInfo({
    userId: 'test-user-123',
    userRole: 'customer',
    loginMethod: 'email_password',
    email: 'test@example.com',
    status: 'success'
  });
  
  console.log('✅ Login saved with ID:', loginId);
}

// Example 2: Save a failed login attempt
async function testFailedLogin() {
  console.log('Testing failed login save...');
  
  const loginId = await loginHistoryService.saveLoginInfo({
    userId: 'unknown@example.com',
    userRole: 'customer',
    loginMethod: 'email_password',
    email: 'unknown@example.com',
    status: 'failed',
    failureReason: 'auth/user-not-found'
  });
  
  console.log('✅ Failed login saved with ID:', loginId);
}

// Example 3: Get user login history
async function testGetUserHistory() {
  console.log('Testing get user login history...');
  
  const history = await loginHistoryService.getUserLoginHistory('test-user-123', 5);
  console.log('✅ User login history:', history);
}

// Example 4: Get all failed login attempts
async function testGetFailedAttempts() {
  console.log('Testing get failed login attempts...');
  
  const failedAttempts = await loginHistoryService.getFailedLoginAttempts(10);
  console.log('✅ Failed login attempts:', failedAttempts);
}

// Example 5: Get login history by role
async function testGetByRole() {
  console.log('Testing get login history by role...');
  
  const adminLogins = await loginHistoryService.getLoginHistoryByRole('admin', 10);
  console.log('✅ Admin login history:', adminLogins);
}

// Run all tests
export async function runLoginHistoryTests() {
  try {
    await testSuccessfulLogin();
    await testFailedLogin();
    await testGetUserHistory();
    await testGetFailedAttempts();
    await testGetByRole();
    
    console.log('✅ All login history tests completed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Uncomment to run tests
// runLoginHistoryTests();
