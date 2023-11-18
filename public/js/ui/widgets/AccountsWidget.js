/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Передан пустой элемент');
    } else {
      this.element = element;
      this.registerEvents();
      this.update();
    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    let createButton = document.querySelector('.create-account');

    createButton.addEventListener('click', () => {
      App.getModal('createAccount').open();
    });

    this.element.addEventListener('click', (event) => {
      let account = event.target.closest('.account');
      if (account) {
        this.onSelectAccount(account);
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      Account.list(User.current(), (err, response) => {
        if (response && response.success) {
          this.clear();
          response.data.forEach((accountData) => {
            this.renderItem(accountData);
          })
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    let accounts = document.querySelectorAll('.account');
    accounts.forEach((account) => {
      account.remove();
    });
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    let accounts = document.querySelectorAll('.account');
    accounts.forEach((account) => {
      account.classList.remove('active');
    });
    element.classList.add('active');
    let accountId = element.getAttribute('data-id')
    App.showPage('transactions', {account_id: accountId})  
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    let newAccount = document.createElement('li');
    newAccount.setAttribute('data-id', item.id);
    newAccount.classList.add('account');
    // newAccount.classList.add('active');

    let a = document.createElement('a');
    a.setAttribute('href', '#');

    newAccount.appendChild(a);

    let spanBank = document.createElement('span');
    let spanSum = document.createElement('span');

    let spanBankContent = document.createTextNode(item.name);
    let spanSumContent = document.createTextNode(item.sum + ' ₽');

    spanBank.appendChild(spanBankContent);
    spanSum.appendChild(spanSumContent);

    a.appendChild(spanBank);
    a.appendChild(document.createTextNode(' / '));
    a.appendChild(spanSum);

    return newAccount;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    let accountHTML = this.getAccountHTML(data);
    this.element.appendChild(accountHTML);
  }
}
