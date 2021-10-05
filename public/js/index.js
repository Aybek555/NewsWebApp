$(".btn").click(function(){
  var text=this.innerText;
  if(text=="Save changes"){
    alert("Article successfully updated!");
  }else if(text=="Delete article"){
    alert("Article successfully deleted!");
  }else if(text=="Create article"){
    alert("Article successfully created!");
  }
})
