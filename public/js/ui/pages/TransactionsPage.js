/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Передан пустой элемент');
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccoutBtn = this.element.querySelector('.remove-account');
    removeAccoutBtn.addEventListener('click', () => this.removeAccount());

    this.element.addEventListener('click', event => {
      const removeButton = event.target.closest('.transaction__remove');
      if (removeButton) {
        this.removeTransaction(removeButton.dataset.id);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return;
    }
    
    const isConfirmed = confirm('Вы действительно хотите удалить счёт?');
    if (isConfirmed) {
      Account.remove({id: this.lastOptions.account_id}, (err, response) => {
        console.log(err, response);
        if (response && response.success) {
          this.clear();
          App.update();
        }
      });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if (this.lastOptions) {
      if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
        Transaction.remove({id}, (err, response) => {
          if (response.success) {
            App.update();
          }
        });
      }
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (options) {
      this.lastOptions = options;
      Account.get(this.lastOptions.account_id, (err, response) => {
        if (response.success) {
          this.renderTitle(response.data.name);
        }
      });
      Transaction.list({account_id: this.lastOptions.account_id}, (err, response) => {
        if (response.success) {
          this.renderTransactions(response.data);
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const titleElement = this.element.querySelector('.content-title');
    titleElement.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    let d = new Date(date);
    let day = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    let hours = d.getHours();
    let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    return `${day} ${month} ${year} г. в ${hours}:${minutes}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    let transactionType = item.type === 'income' ? 'transaction_income' : 'transaction_expense';
    return `
        <div class="transaction ${transactionType} row">
            <div class="col-md-7 transaction__details">
                <div class="transaction__icon">
                    <span class="fa fa-money fa-2x"></span>
                </div>
                <div class="transaction__info">
                    <h4 class="transaction__title">${item.name}</h4>
                    <div class="transaction__date">${this.formatDate(item.created_at)}</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="transaction__summ">
                    ${item.sum} <span class="currency">₽</span>
                </div>
            </div>
            <div class="col-md-2 transaction__controls">
                <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                    <i class="fa fa-trash"></i>  
                </button>
            </div>
        </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const contentElement = this.element.querySelector('.content');

    const htmlString = data.reduce((html, item) => {
      return html + this.getTransactionHTML(item);
    }, '');

    contentElement.innerHTML = htmlString;
  }
}