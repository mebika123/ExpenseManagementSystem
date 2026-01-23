<?php

namespace App\Imports;

use App\Models\Department;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class DepartmentImport implements ToModel,WithHeadingRow,WithBatchInserts,WithChunkReading
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        Log::info($row);
        return new Department([
            'name' =>$row['name'],
            'code' =>$row['code']
        ]);
    }
     public function batchSize(): int
    {
        return 1000;
    }

    public function chunkSize(): int
    {
        return 1000; 
    }
}
