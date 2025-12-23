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


        $superAdminRole = Role::firstOrCreate(['name' => 'superadmin']);
        $employeeRole = Role::firstOrCreate(['name' => 'employee']);
        $managerRole = Role::firstOrCreate(['name' => 'manager']);
        $financeRole = Role::firstOrCreate(['name' => 'finance']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        $permissions = [
            'user-create',
            'user-view',
            'user-edit',
            'user-delete',

            'contact-create',
            'contact-view',
            'contact-edit',
            'contact-delete',

            'department-create',
            'department-view',
            'department-edit',
            'department-delete',

            'location-create',
            'location-view',
            'location-edit',
            'location-delete',

            'budget-create',
            'budget-view',
            'budget-edit',
            'budget-delete',
            'budget-change-status',

            'expense-create',
            'expense-view',
            'expense-edit',
            'expense-delete',
            'expense-change-status',

            'remibursment-change-status'

        ];
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $superAdminRole->syncPermissions(Permission::all());
        $adminRole->syncPermissions(Permission::all());

        $employeeRole->givePermissionTo([
            'contact-create',
            'contact-view',
            'department-view',
            'location-view',
            'budget-view',
            'expense-create',
            'expense-view',
            'expense-edit',
            'expense-delete'
        ]);

        $managerRole->givePermissionTo([
            'user-create',
            'user-view',
            'user-edit',
            'user-delete',

            'contact-create',
            'contact-view',
            'contact-edit',
            'contact-delete',

            'department-create',
            'department-view',
            'department-edit',
            'department-delete',

            'location-create',
            'location-view',
            'location-edit',
            'location-delete',

            'budget-change-status',
            'expense-change-status',
            'remibursment-change-status',
        ]);

        $financeRole->givePermissionTo([
            'budget-create',
            'budget-view',
            'budget-edit',
            'budget-delete',
            'remibursment-change-status'
        ]);

        $user = User::create([
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        $user->assignRole('superadmin');
    }
}
