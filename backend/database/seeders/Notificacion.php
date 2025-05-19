<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class notificacion extends Seeder{
    public function run(): void{
       $responsableIds = DB::table('responsable_gestion')->pluck('responsable_id')->toArray();
       $tutorIds = DB::table('tutor')->pluck('tutor_id')->toArray();
       $competidorIds = DB::table('competidor')->pluck('competidor_id')->toArray();
       
       if (empty($responsableIds) || empty($tutorIds)) {
           $this->command->info('No hay responsables o tutores en la base de datos. Ejecuta los seeders correspondientes primero.');
           return;
       }
       
       $tiposNotificacion = [
           'Error en datos del tutor',
           'Error en datos del competidor',
           'Confirmación de inscripción',
           'Recordatorio de pago',
           'Información general',
       ];
       
       $notificaciones = [];
       
       for ($i = 1; $i <= 30; $i++) {
           $tipoNotificacion = $tiposNotificacion[array_rand($tiposNotificacion)];
           $incluyeCompetidor = in_array($tipoNotificacion, ['Error en datos del competidor', 'Confirmación de inscripción']);
           $competidorId = $incluyeCompetidor && !empty($competidorIds) ? $competidorIds[array_rand($competidorIds)] : null;
            $notificaciones[] = [
                'responsable_id' => $responsableIds[array_rand($responsableIds)],
                'tutor_id' => $tutorIds[array_rand($tutorIds)],
                'competidor_id' => $competidorId,
                'asunto' => $tipoNotificacion . ' - ' . date('d/m/Y'),
                'mensaje' => $this->generarMensaje($tipoNotificacion, $competidorId),
                'fecha_envio' => Carbon::now()->subDays(rand(0, 30)),
                'estado' => rand(0, 1),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
        }
        
        DB::table('notificacion')->insert($notificaciones);
        
        $this->command->info('Se han creado 30 notificaciones de ejemplo.');
    }

    private function generarMensaje($tipo, $competidorId){
        switch ($tipo) {
            case 'Error en datos del tutor':
                return 'Estimado tutor, hemos detectado que algunos de sus datos personales están incompletos o incorrectos. Por favor, actualice su información lo antes posible para continuar con el proceso de inscripción.';
                
            case 'Error en datos del competidor':
                $competidor = null;
                if ($competidorId) {
                    $competidor = DB::table('competidor')->where('competidor_id', $competidorId)->first();
                }
                
                $nombreCompetidor = $competidor ? $competidor->nombres . ' ' . $competidor->apellidos : 'el competidor';
                
                return "Estimado tutor, hemos detectado que los datos de {$nombreCompetidor} están incompletos o incorrectos. Por favor, actualice la información lo antes posible para continuar con el proceso de inscripción.";
                
            case 'Confirmación de inscripción':
                return 'Felicitaciones! La inscripción ha sido completada exitosamente. El competidor ya está registrado para participar en la olimpiada. Recuerde estar atento a las fechas del cronograma.';
                
            case 'Recordatorio de pago':
                return 'Le recordamos que tiene pendiente el pago de la inscripción. Por favor, realice el pago lo antes posible para completar el proceso de inscripción.';
                
            case 'Información general':
                return 'Estimado tutor, le informamos que se han actualizado las fechas del cronograma de la olimpiada. Por favor, revise la información en el sitio web oficial.';
                
            default:
                return 'Notificación del sistema de olimpiadas.';
        }
    }
}
