<?php

namespace App\Repositories;

use App\Interfaces\BaseInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;


class BaseRepository implements BaseInterface
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function all()
    {
        return $this->model->all();
    }

    public function find($id)
    {
        return $this->model->find($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $record = $this->model->findOrFail($id);
        return $record->update($data);
    }

    // public function save($id = null,array $data)
    // {
    // //         $searchCriteria = $id ? ['id' => $id] : [];

    // //     return $this->model->updateOrCreate($searchCriteria, $data);
    // $searchCriteria = $id ? ['id' => $id] : [];
    
    // Log::info('updateOrCreate called', [
    //     'searchCriteria' => $searchCriteria,
    //     'isEmpty' => empty($searchCriteria),
    //     'data' => $data
    // ]);
    
    // if (empty($searchCriteria)) {
    //     Log::info('Using create instead of updateOrCreate');
    //     return $this->model->create($data);
    // }
    
    // return $this->model->updateOrCreate($searchCriteria, $data);
    // }
    public function save(?int $id, array $data)
{
    return $this->model->updateOrCreate(['id' => $id],$data);
    // if ($id) {
    //     return $this->model->updateOrCreate(['id' => $id], $data);
    // }
    // return $this->model->create($data);
    // return $this->model->upsert($data,$id,$col);
    
}


    public function delete($id)
    {
        return $this->model->destroy($id);
    }
}
