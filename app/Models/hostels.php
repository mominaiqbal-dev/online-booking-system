<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class hostels extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'location',
        'contact',
        'image',
        'capacity',
        'rating',
    ];

    public function rooms(){
        return $this->hasMany(Room::class);
    }

    public function guests(){
        //return $this->hasMany(guests::class);
    }
}
