<?php
  namespace App\Interfaces;

  interface HasStatus{
    public function statuses();

    public function currentStatus(): ?string;

  }