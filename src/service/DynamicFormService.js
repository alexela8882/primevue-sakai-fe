export default class DynamicFormService {
  getTaskForm () {
    return fetch('demo/data/DynamicForm/task-form.json')
      .then((res) => res.json())
      .then((d) => d.data)
  }

  getEventForm () {
    return fetch('demo/data/DynamicForm/event-form.json')
      .then((res) => res.json())
      .then((d) => d.data)
  }
}
