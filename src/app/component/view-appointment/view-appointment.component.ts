import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { Event } from '../../interface/event';
import { MatButtonModule } from '@angular/material/button';
import { EventService } from '../../service/event.service';

@Component({
  selector: 'app-view-appointment',
  standalone: true,
  imports: [MatDialogClose, MatButtonModule],
  templateUrl: './view-appointment.component.html',
  styles: ``
})
export class ViewAppointmentComponent {
  eventData!: any;
  eventService = inject(EventService)
  constructor(public dialogRef: MatDialogRef<ViewAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log(data);
      this.eventData = data._def.extendedProps;

    }

  deleteEvent() {
    this.eventService.deleteEventById(this.eventData.id_).subscribe(res=> {
      console.log(res);
      this.dialogRef.close()

    })
  }
}
