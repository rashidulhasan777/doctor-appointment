import { Component , signal, ChangeDetectorRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { MatDialog } from '@angular/material/dialog';
import { ChangeYearComponent } from './component/change-year/change-year.component';
import { ChangeMonthComponent } from './component/change-month/change-month.component';
import { CreateAppointmentComponent } from './component/create-appointment/create-appointment.component';
import { EventService } from './service/event.service';
import { ViewAppointmentComponent } from './component/view-appointment/view-appointment.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild(FullCalendarComponent) calendarComponent!: FullCalendarComponent;
  eventService = inject(EventService);
  calendarVisible = signal(true);
  INITIAL_EVENTS: EventInput[] = [];
  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'customYear, customMonth',
      // left: 'prev,next today',
      center: 'title',
      right: 'prev,next createAppointment'
      // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      // dropdown year in left
    },
    customButtons: {
      customYear: {
        text: 'Change Year',
        click: () => {
          const calendarApi = this.calendarComponent.getApi();
          // handle the click event, show dropdown for year selection
          const dialogRef = this.dialog.open(ChangeYearComponent);
          // console.log('customYear clicked');
          this.dialog.afterAllClosed.subscribe(() => {
            console.log('The dialog was closed');
            console.log('selectedYear: ', dialogRef.componentInstance.selectedYear);
            calendarApi.gotoDate(`${dialogRef.componentInstance.selectedYear}-01-01`);
          });
          // calendarApi.gotoDate('2021-01-01');

        }
      },
      customMonth: {
        text: 'Change Month',
        click: () => {
          const calendarApi = this.calendarComponent.getApi();
          const dialogRef = this.dialog.open(ChangeMonthComponent);
          this.dialog.afterAllClosed.subscribe(() => {
            let selectedMonth: string | number = dialogRef.componentInstance.selectedMonth;
            if (selectedMonth < 10) {
              selectedMonth = `0${selectedMonth}`;
            }
            console.log('The dialog was closed');
            console.log('selectedMonth: ', );
            calendarApi.gotoDate(`${calendarApi.getDate().getFullYear()}-${selectedMonth}-01`);
          });
          // calendarApi.gotoDate('2021-05-01');
        }
      },
      createAppointment: {
        text: 'Create Appointment',
        click: () => {
          // handle the click event, show dialog for appointment creation
          console.log('createAppointment clicked');
          const dialogRef = this.dialog.open(CreateAppointmentComponent, {
            height: '600px',
            width: '600px',
          });
          this.dialog.afterAllClosed.subscribe(() => {
            console.log('The dialog was closed');
            this.updateInitialEvents();
          });
        }
      }
    },
    initialView: 'dayGridMonth',
    initialEvents: this.INITIAL_EVENTS,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    events: this.INITIAL_EVENTS,
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(private changeDetector: ChangeDetectorRef, public dialog: MatDialog) {
  }

  ngAfterViewInit(): void {

      // console.log(res);
      this.updateInitialEvents();

  }

 updateInitialEvents(): void {
  this.eventService.getEvent().subscribe((events) => {
    const initialEvents: EventInput[] = [];
    events.forEach((event: any) => {
      initialEvents.push({
        id: event.payload.id,
        title: event.payload.title.slice(0, 15)+'...',
        start: event.payload.start,
        end: event.payload.end,
        name: event.name,
        gender: event.gender,
        age: event.age,
        date_: event.date,
        time: event.time,
        id_: event.id
      });
    });
    this.INITIAL_EVENTS = initialEvents;
    this.calendarOptions.update((options) => ({
      ...options,
      initialEvents: this.INITIAL_EVENTS,
      events: this.INITIAL_EVENTS,
    }));
    this.changeDetector.detectChanges();
  });
  }

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {

    const dialogRef = this.dialog.open(CreateAppointmentComponent, {
      height: '600px',
      width: '600px',
      data: {
        date: selectInfo.startStr
      }
    });
    this.dialog.afterAllClosed.subscribe(() => {
      console.log('The dialog was closed');
      this.updateInitialEvents();
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    const dialogRef = this.dialog.open(ViewAppointmentComponent, {
      height: '600px',
      width: '600px',
      data: clickInfo.event
    });
    dialogRef.afterClosed().subscribe(()=>{
      this.updateInitialEvents();
    })

  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }
}
