import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Words } from './words.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'wordapp';
  wordArray : any;
  baseUrl: string = "http://localhost:9090/api";

  isShow: boolean = false;
  wordForm ={
    "id" : 0,
    "word" : ""
  }

  constructor( private fb: FormBuilder,private http: HttpClient) {    
  }

  ngOnInit() {
    this.fetchPosts();
  }

  onSubmit(data){
    console.log(data);
    if(data.id == 0){
      this.saveWord(data);
    }
    else{
        this.editWord(data);
    }
    
  }

  clearFields(){
    this.wordForm['id'] = 0;
    this.wordForm['word'] = "";
  }
 
  saveWord(data){
    this.http.post(this.baseUrl ,  data)
        .subscribe(res => {
          this.clearFields();
          this.fetchPosts();
             
      })
   
  }

  editWord(data){
    this.http.put(this.baseUrl , data)
    .subscribe(res => {
      console.log(res);
       this.clearFields();
       this.fetchPosts();
    })
    
  }

  fetchPosts() {  
    this.http.get(this.baseUrl).subscribe((data)=>{
       this.wordArray = data;
      if(this.wordArray != null){
        this.isShow = true;
      }else{
        this.isShow = false;
      }
    });   
  
}

deleteWord(id : any){
  Swal.fire({
    title: 'Are you sure?',
    text: 'You want to delete this record!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it',
  }).then((result) => {

    if (result.isConfirmed) {

      console.log('Clicked Yes, File deleted!');
      return this.http.delete( this.baseUrl  + `/wordById?id=${id}`)
      .subscribe(res => {
          console.log("Deleted data" + res);
        this.fetchPosts();
      })
  } else if (result.isDismissed) {
         console.log('Clicked No, File is safe!');

      }
  })
}

getWord(id : any){
return this.http.get(this.baseUrl + `/wordDelete/${id}`)
.subscribe(res => { 
  let wordarr:any = res;
  this.wordForm['word'] = wordarr.word; 
  this.wordForm['id'] = wordarr.id; 
  
})

}



}
