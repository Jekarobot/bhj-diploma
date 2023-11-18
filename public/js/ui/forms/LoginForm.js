/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.login(data, (err, response) => {
      if (response.success) {
        let form = this.element.closest('.form');
        form.reset();
        
        App.setState('user-logged');

        let modalId = this.element.closest('.modal').getAttribute('data-modal-id');
        let modalInstance = App.modals[modalId];
        modalInstance.close();
      } else {
        console.log(err);
      }
    });
    
  }
}