<?php
namespace App\Repositories;

use App\Models\Employee;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;

class EmployeeRepository extends BaseRepository{
    public function __construct(Employee $model)
    {
        return parent::__construct($model);
    }
}