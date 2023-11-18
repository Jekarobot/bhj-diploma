/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Передан пустой элемент');
    } else {
      this.element = element;
    }
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    let income = this.element.querySelector('.create-income-button');
    let expense = this.element.querySelector('.create-expense-button');

    income.addEventListener('click', () => {
      App.getModal('newIncome');
    });

    expense.addEventListener('click', () => {
      App.getModal('newExpense');
    });
  }
}
