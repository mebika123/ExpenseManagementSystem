<?php

namespace App\Repositories;

use App\Interfaces\BaseInterface;
use App\Models\Location;

class LocationRepository extends BaseRepository implements BaseInterface
{
    public function __construct(Location $model)
    {
        parent::__construct($model);
    }

}