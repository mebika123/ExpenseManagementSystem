<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('expense_items', function (Blueprint $table) {
            $table->index('expense_id', 'idx_expense_items_expense_id');
            $table->index(['expense_id', 'paid_by_id'], 'idx_expense_items_expense_id_paid_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expense_items', function (Blueprint $table) {
             $table->dropIndex('idx_expense_items_expense_id');
            $table->dropIndex('idx_expense_items_expense_id_paid_by');
        });
    }
};
