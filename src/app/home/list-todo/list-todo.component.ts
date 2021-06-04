import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService, Todo } from 'src/app/API.service';
import { IonInfiniteScroll, Platform } from '@ionic/angular';

@Component({
  selector: 'app-list-todo',
  templateUrl: './list-todo.component.html',
  styleUrls: ['./list-todo.component.scss'],
})
export class ListTodoComponent implements OnInit {
  todos: Array<Todo>;
  nextToken: string = null;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private api: APIService,
    private platform: Platform,
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    [this.todos, this.nextToken] = await this.api.ListTodos(null, 5, this.nextToken).then(e => { return [e.items, e.nextToken] });
    this.api.OnCreateTodoListener.subscribe((event: any) => {
      const newTodo = event.value.data.onCreateTodo;
      this.todos = [newTodo, ...this.todos];
    })
  }

  async loadNextTodos(event) {
    let nextTodos;
    [nextTodos, this.nextToken] = await this.api.ListTodos(null, 5, this.nextToken).then(e => { return [e.items, e.nextToken] });
    if (this.nextToken == null) {
      event.target.disabled = true;
    }
    event.target.complete();
    this.todos = [...this.todos, ...nextTodos];
    if (this.todos.length > 300) {
      event.target.disabled = true;
    }
  }

}
