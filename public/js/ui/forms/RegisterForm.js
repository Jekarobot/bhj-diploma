/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register(data, (err, response) => {
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