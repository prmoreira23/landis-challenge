function changeProgress(val, err=false){
  let progressBar = document.getElementById("progress-bar");
  progressBar.classList.remove("progress-bar-danger");

  if(val >= 0 && val <= 100){
    progressBar.style.width = `${val}%`;
    progressBar.setAttribute("aria-valuenow", `${val}`);
    progressBar.innerHTML = `${val}%`;
  }

  if(val == 100){
    progressBar.innerHTML = `Complete!`;
  }

  if (err) {
    progressBar.innerHTML = `Error!`;
    progressBar.classList.add("progress-bar-danger");
  }
}

changeProgress(0);

function valideURL(url){
  if( /^https:\/\/(|www\.)?docsend.com\/view\//.test(url) ) {
     return true;
  }else{
     return false;
  }
}

$('.form-horizontal').on('submit', function(event) {
  event.preventDefault();
  let url = document.getElementById("url").value;
  if(valideURL(url)){
    let $this = $(document.getElementById('load'));
    let form = this;

    $this.button('loading');
    let i = 0;
    let interval = setInterval(function(){
      changeProgress(i);
      i = i + 1;
    }, 1200)

    fetch("/savepdf", {
      method: "POST",
      body: new FormData(form),
    }).then(res => {
      if(res.status === 200){
        console.log("Success");
        let filename = res.headers.get("Content-Disposition").split("filename=")[1];
        res.blob().then(blob => {
          let path = saveAs(blob, filename);
          changeProgress(100);
        })
      } else if(res.status === 500){
        changeProgress(100, true);
      }
      $this.button('reset');
    }).catch(function() {
      console.log("error");
      changeProgress(100, true);
    }).finally(function(){
      clearInterval(interval);
    });
  } else {
    alert("URL Invalid...");
  }
});
