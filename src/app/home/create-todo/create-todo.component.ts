import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo, APIService } from 'src/app/API.service';
import { Platform } from '@ionic/angular';
import { Auth, Storage } from 'aws-amplify';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.scss'],
})
export class CreateTodoComponent implements OnInit {
  public createForm: FormGroup;
  public progressRate: number = 0;
  username: string;
  level: string = "protected";
  imagekey: string;
  fileObj: File;

  constructor(
    private api: APIService,
    private platform: Platform,
    private fb: FormBuilder,
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    this.username = await Auth.currentAuthenticatedUser().then(e => e.username);
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  async createTodo(todo: Todo) {
    this.progressRate += 0.01;
    const _this = this;
    const result = await Storage.put(this.imagekey, this.fileObj, {
      level: this.level,
      progressCallback(progress) {
        _this.updateProgress(progress.loaded / progress.total);
      }
    })
    todo.id = Date.now().toString();
    todo.imagekey = this.imagekey;
    todo.level = this.level;
    this.api.CreateTodo(todo).then(_ => {
      this.progressRate += 0.29;
      setTimeout(() => {
        this.progressRate += 0.01;
      }, 100);
      console.log('created todo');
    }).catch(e => {
      console.log('error occured in creating todo');
    });
  }

  updateProgress(rate: number) {
    this.progressRate = 0.7 * rate;
  }

  onChooseImage(event) {
    if (event.target.files.length > 0) {
      const timestamp = Math.floor(Date.now() / 1000);
      this.imagekey = `${this.username}${timestamp}.jpeg`;
      this.fileObj = event.target.files[0];
    }
  }

}
