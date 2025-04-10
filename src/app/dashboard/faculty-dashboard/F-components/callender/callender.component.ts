import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


@Component({
  selector: 'app-callender',
  standalone:false,
  templateUrl: './callender.component.html',
  styleUrls: ['./callender.component.css']
})
export class CallenderComponent {
  months = [
    { name: 'January', value: 0 }, { name: 'February', value: 1 },
    { name: 'March', value: 2 }, { name: 'April', value: 3 },
    { name: 'May', value: 4 }, { name: 'June', value: 5 },
    { name: 'July', value: 6 }, { name: 'August', value: 7 },
    { name: 'September', value: 8 }, { name: 'October', value: 9 },
    { name: 'November', value: 10 }, { name: 'December', value: 11 }
  ];

  selectedDateRange: any = null;
  newTitle: string = '';
  faculty: string = '';

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    slotMinTime: '09:00:00',
    slotMaxTime: '19:00:00',
    snapDuration: '00:15:00',
    slotLabelInterval: '01:00:00',
    allDaySlot: false,
    selectable: true,
    editable: true,
    height: 'auto',
    nowIndicator: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    dayHeaderFormat: { weekday: 'short' },
    events: [],
    select: this.onDateSelect.bind(this),
    eventClick: this.onEventClick.bind(this),
    eventContent: function (arg: any) {
      const event = arg.event;
      const timeText = arg.timeText;

      const eventEl = document.createElement('div');
      eventEl.innerHTML = `
        <div style="font-size: 13px; font-weight: bold;">${timeText}</div>
        <div>${event.title}</div>
        <div style="font-size: 12px; color: white; font-weight: bold;">
          ${(event as any).extendedProps.faculty || ''}
        </div>
      `;
      return { domNodes: [eventEl] };
    },
    views: {
      timeGridWeek: { dayHeaderFormat: { weekday: 'short', day: 'numeric' } },
      dayGridWeek: { dayHeaderFormat: { weekday: 'short', day: 'numeric' } },
      dayGridMonth: { dayHeaderFormat: { weekday: 'short' } },
      timeGridDay: { dayHeaderFormat: { weekday: 'short', day: 'numeric' } }
    }
  };

  onDateSelect(selectInfo: any) {
    this.selectedDateRange = selectInfo;
    this.newTitle = '';
    this.faculty = '';

    const start = new Date(selectInfo.startStr);
    const end = new Date(selectInfo.endStr);

    console.log("Selected Start:", start.toLocaleTimeString());
    console.log("Selected End:", end.toLocaleTimeString());

    const modal = document.getElementById('eventModal');
    if (modal) modal.style.display = 'block';

    const timeDisplay = document.getElementById('selectedTimeDisplay');
    if (timeDisplay) {
      timeDisplay.innerText = `Selected Time: ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  }

  addEvent() {
    if (this.selectedDateRange && this.newTitle.trim() !== '') {
      (this.calendarOptions.events as any[]).push({
        title: this.newTitle,
        start: this.selectedDateRange.startStr,
        end: this.selectedDateRange.endStr,
        extendedProps: { faculty: this.faculty }
      });
    }

    this.selectedDateRange = null;
    const modal = document.getElementById('eventModal');
    if (modal) modal.style.display = 'none';
  }

  onEventClick(clickInfo: any) {
    if (confirm(`Delete the event '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
    }
  }

  closeModal() {
    const modal = document.getElementById('eventModal');
    if (modal) modal.style.display = 'none';
  }
}
