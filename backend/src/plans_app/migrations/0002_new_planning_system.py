# Generated manually for new planning system - November 1, 2025

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('plans_app', '0001_initial'),
    ]

    operations = [
        # Remove old fields
        migrations.RemoveField(
            model_name='planificacion',
            name='contenido',
        ),
        
        # Add new fields to Planificacion
        migrations.AddField(
            model_name='planificacion',
            name='estado',
            field=models.CharField(
                choices=[('borrador', 'Borrador'), ('en_validacion', 'En Validación'), 
                        ('validada', 'Validada'), ('finalizada', 'Finalizada')],
                default='borrador', max_length=20
            ),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='asignatura',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='nivel_educativo',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='curso',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='unidad_tematica',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='duracion_horas',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='objetivo_general',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='objetivos_especificos',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='competencias_disciplinares',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='competencias_genericas',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='metodologia',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='estrategias_ensenanza',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='recursos_materiales',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='instrumentos_evaluacion',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='criterios_evaluacion',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='contenido_tematico',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='actividades_aprendizaje',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='feedback_ia',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='sugerencias_mejora',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='validacion_final',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='planificacion',
            name='version',
            field=models.IntegerField(default=1),
        ),
        
        # Create new FeedbackValidacion model
        migrations.CreateModel(
            name='FeedbackValidacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('feedback_texto', models.TextField()),
                ('puntuacion', models.FloatField(blank=True, null=True)),
                ('aspectos_positivos', models.JSONField(blank=True, default=list)),
                ('aspectos_mejorar', models.JSONField(blank=True, default=list)),
                ('sugerencias', models.JSONField(blank=True, default=list)),
                ('alineamiento_capitulos', models.JSONField(blank=True, default=dict)),
                ('creado_en', models.DateTimeField(auto_now_add=True)),
                ('planificacion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='validaciones', to='plans_app.planificacion')),
            ],
            options={
                'ordering': ['-creado_en'],
            },
        ),
    ]