import { Component, OnInit } from '@angular/core';
import { APIService, Todo } from 'src/app/API.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-list-todo',
  templateUrl: './list-todo.component.html',
  styleUrls: ['./list-todo.component.scss'],
})
export class ListTodoComponent implements OnInit {
  todos: Array<Todo>;

  constructor(
    private api: APIService,
    private platform: Platform,
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    this.todos = await this.api.ListTodos().then(e => e.items);
    this.api.OnCreateTodoListener.subscribe((event: any) => {
      const newTodo = event.value.data.onCreateTodo;
      this.todos = [newTodo, ...this.todos];
    })
  }

}
