class Status {
  step = new Number();
  title = new String();
}

const submitted = new Status();
submitted.step = 1;
submitted.title = 'در انتظار پرداخت';

const paid = new Status();
paid.step = 2;
paid.title = 'پرداخت شده';

const preparing = new Status();
preparing.step = 3;
preparing.title = 'در حال آماده سازی سفارش';

const sent = new Status();
sent.step = 4;
sent.title = 'ارسال شده';

const done = new Status();
done.step = 5;
done.title = 'تحویل شده';

const OrderStatus = {
  Submitted: submitted,
  Paid: paid,
  Preparing: preparing,
  Sent: sent,
  Done: done,
};

module.exports = {
  Status,
  OrderStatus,
}