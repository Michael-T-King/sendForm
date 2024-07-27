"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const buttonForm = document.querySelector(".btn__form");
  const Wrapper = document.querySelector(".wrapper");
  const closeBtn = document.querySelector(".btn__close");
  const poPup = document.querySelector(".popup");

  buttonForm.addEventListener("click", () => {
    Wrapper.classList.add("show");
  });

  closeBtn.addEventListener("click", () => {
    Wrapper.classList.remove("show");
  });

  Wrapper.addEventListener("click", (event) => {
    if (!poPup.contains(event.target)) {
      Wrapper.classList.remove("show");
    }
  });

  //----------------- Валидация полей --------------------------------------------
  const form = document.querySelector(".form");
  form.addEventListener("submit", formSend);

  async function formSend(e) {
    e.preventDefault();
    let error = formValidate(form);
  
    let formData = new FormData(form);
    let data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    if (error === 0) {
      try {
        let response = await fetch('/api/sendMail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
        });
        console.log(response)
  
        if (response.ok) {
          let result = await response.json();
          alert(result.message);
          form.reset();
          poPup.classList.remove('_sending');
        } else {
          alert('Что-то пошло не так!');
          poPup.classList.remove('_sending');
        }
      } catch (error) {
        console.error(error);
        alert('Ошибка при отправке письма');
      }
    } else {
      alert('Заполните обязательные поля');
    }
  }

  function formValidate(form) {
    let error = 0;
    let formReq = document.querySelectorAll("._req");
    for (let i = 0; i < formReq.length; i++) {
      const input = formReq[i];
      formRemoveError(input);

      if (input.classList.contains("_email")) {
        if (emailCheck(input)) {
          formAddError(input);
          error++;
        }
      } else if (input.getAttribute("type") === "checkbox") {
        if (!input.checked) {
          formAddError(input);
          error++;
        }
      } else {
        if (input.value === "") {
          formAddError(input);
          error++;
        }
      }
    }
    return error;
  }

  function formAddError(input) {
    input.parentElement.classList.add("_error");
    input.classList.add("_error");
  }

  function formRemoveError(input) {
    input.parentElement.classList.remove("_error");
    input.classList.remove("_error");
  }

  function emailCheck(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
  }
});
