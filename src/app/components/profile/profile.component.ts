import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  imagePath =  './assets/img/default.png';
  name = "JACKSON WANG";
  professionalTitle = "Software Engineer";
  aboutMe = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";
  skills = "Clean toilet, Mop floor, eat, sleep, shit";

  constructor() { }

  ngOnInit(): void {
  }

}
