<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);


        // $superAdminRole = Role::firstOrCreate(['name' => 'superadmin']);
        // $employeeRole = Role::firstOrCreate(['name' => 'employee']);
        // $managerRole = Role::firstOrCreate(['name' => 'manager']);
        // $financeRole = Role::firstOrCreate(['name' => 'finance']);
        // $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // $permissions = [
        //     'advance.view',
        //     'advance.create',
        //     'advance.update',
        //     'advance.show',
        //     'advance.delete',
        //     'advance.status.check',
        //     'advance.status.approve',

        //     'budgetTimeline.view',
        //     'budgetTimeline.create',
        //     'budgetTimeline.update',
        //     'budgetTimeline.show',
        //     'budgetTimeline.delete',
        //     'budgetTimeline.delete.budgets',
        //     'budgetTimeline.status.check',
        //     'budgetTimeline.status.approve',

        //     'contact.view',
        //     'contact.create',
        //     'contact.update',
        //     'contact.show',
        //     'contact.delete',
        //     'contact.view',

        //     'department.view',
        //     'department.create',
        //     'department.update',
        //     'department.show',
        //     'department.delete',

        //     'location.view',
        //     'location.create',
        //     'location.update',
        //     'location.show',
        //     'location.delete',

        //     'expense_category.view',
        //     'expense_category.create',
        //     'expense_category.update',
        //     'expense_category.show',
        //     'expense_category.delete',

        //     'expense.view',
        //     'expense.view.all',
        //     'expense.create',
        //     'expense.update',
        //     'expense.show',
        //     'expense.delete',
        //     'expense.showItemsDetails',
        //     'expense.status.check',
        //     'expense.status.approve',

        //     'expense_plan.view',
        //     'expense_plan.view.all',
        //     'expense_plan.create',
        //     'expense_plan.update',
        //     'expense_plan.show',
        //     'expense_plan.delete',
        //     'expense_plan.showItemsDetails',
        //     'expense_plan.status.check',
        //     'expense_plan.status.approve',

        //     'reimbursement.view',
        //     'reimbursement.update',

        //     'advanceSettlement.view',
        //     'advanceSettlement.update',

        //     'transactional_log.view',
        //     'transactional_log.unsettled.view',
        //     'transactional_log.settle',

        //     'role.view',
        //     'role.create',
        //     'role.update',
        //     'role.show',
        //     'role.delete',

        //     'user.view',
        //     'user.create',
        //     'user.update',
        //     'user.show',
        //     'user.delete',
        // ];
        // $permissions = [
        //     // 'expense.view.all',
        //     // 'expense_plan.view.all',
        //     'dashboard.view.all',
        // ];
        // foreach ($permissions as $permission) {
        //     Permission::firstOrCreate(['name' => $permission]);
        // }
        $superAdminRole = Role::findByName('superadmin');
        $superAdminRole->syncPermissions(Permission::all());
        //     $adminRole->syncPermissions(Permission::all());

        //     $employeeRole->givePermissionTo([
        //         'contact.create',
        //         'contact.view',
        //         'department.view',
        //         'location.view',

        //         'expense.view',
        //         'expense.create',
        //         'expense.update',
        //         'expense.show',
        //         'expense.delete',
        //         'expense.showItemsDetails',

        //         'expense_plan.view',
        //         'expense_plan.create',
        //         'expense_plan.update',
        //         'expense_plan.show',
        //         'expense_plan.delete',
        //         'expense_plan.showItemsDetails',
        //     ]);

        //     $managerRole->givePermissionTo([
        //         'user.create',
        //         'user.view',
        //         'user.update',
        //         'user.delete',

        //         'contact.create',
        //         'contact.view',
        //         'contact.update',
        //         'contact.delete',

        //         'department.create',
        //         'department.view',
        //         'department.update',
        //         'department.delete',

        //         'location.create',
        //         'location.view',
        //         'location.update',
        //         'location.delete',


        //     ]);

        //     $financeRole->givePermissionTo([
        //         'budgetTimeline.view',
        //         'budgetTimeline.create',
        //         'budgetTimeline.update',
        //         'budgetTimeline.show',
        //         'budgetTimeline.delete',
        //         'budgetTimeline.delete.budgets',

        //         'reimbursement.view',
        //         'reimbursement.update',

        //         'advanceSettlement.view',
        //         'advanceSettlement.update',

        //         'transactional_log.view',
        //         'transactional_log.unsettled.view',
        //         'transactional_log.settle',
        //     ]);

        //     $user = User::updateOrCreate(['email' => 'admin@example.com'], [
        //         'password' => bcrypt('password'),
        //     ]);

        //     $user->assignRole('superadmin');
    }
}
