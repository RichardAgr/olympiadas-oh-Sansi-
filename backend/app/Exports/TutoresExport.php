<?php

namespace App\Exports;

use App\Models\Tutor;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class TutoresExport implements FromCollection, WithHeadings
{
    /**
     * Export the collection of tutors with active competitors count
     *
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Tutor::withCount([
            'competidores as competidores_activos' => function ($query) {
                $query->where('estado', 'Inscrito');
            }
        ])->get()->map(function ($tutor) {
            return [
                'Nombres' => $tutor->nombres,
                'Apellidos' => $tutor->apellidos,
                'CI' => $tutor->ci,
                'Estado' => $tutor->estado,
                'Competidores Activos' => $tutor->competidores_activos
            ];
        });
    }

    /**
     * Define column headings for the Excel sheet
     *
     * @return array
     */
    public function headings(): array
    {
        return [
            'Nombres',
            'Apellidos',
            'CI',
            'Estado',
            'Competidores Activos'
        ];
    }
}
