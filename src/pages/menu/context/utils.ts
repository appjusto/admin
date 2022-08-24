import { BusinessSchedule, ScheduleObject } from '@appjusto/types';

export const getAvailabilitySchema = (
  initialAvailability: BusinessSchedule,
  availability?: BusinessSchedule
) => {
  if (!availability) return initialAvailability;
  const availabilitySchema = availability.map((day) => {
    if (day.schedule.length === 0) {
      return {
        ...day,
        schedule: [{ from: '', to: '' }],
      };
    } else {
      return day;
    }
  });
  return availabilitySchema;
};

export const schedulesValidation = (schedules: ScheduleObject[]) => {
  let result = true;
  schedules.forEach((scheduleObject) => {
    scheduleObject.schedule.forEach((item, index) => {
      if (item.from !== '' && item.to !== '') {
        if (Number(item.from) >= Number(item.to)) result = false;
        if (
          index > 0 &&
          Number(item.from) <= Number(scheduleObject.schedule[index - 1].to)
        )
          result = false;
      }
    });
  });
  return result;
};

export const getSerializedAvailability = (availability: BusinessSchedule) => {
  const newAvailability = availability.map((day) => {
    if (!day.checked) {
      return {
        ...day,
        schedule: [],
      };
    }
    const newSchedule = day.schedule.filter(
      (obj) => obj.from !== '' && obj.to !== ''
    );
    return { ...day, schedule: newSchedule };
  });
  return newAvailability;
};
