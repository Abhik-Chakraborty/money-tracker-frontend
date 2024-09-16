// import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';

// function App() {
//   const [name, setName] = useState('');
//   const [datetime, setDatetime] = useState('');
//   const [description, setDescription] = useState('');
//   function addNewTransaction(ev) {
//     ev.preventDefault();
//     const url = process.env.REACT_APP_API_URL+'/transaction';
//     // console.log(url);

//     fetch(url, {
//       method: 'POST',
//       header: {'Content-type' : 'application/json'},
//       body: {name, description,datetime}
//     }).then(response => {
//       response.json().then(json => {
//         console.log('result', json);
//       });
//     });
//   }

function App() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('spent');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]); 
  const [balance, setBalance] = useState('');

  //my work starts here
  const fetchTransaction = async () => {
    const url = "http://localhost:3001/transaction/all";
    try {
      const response = await fetch(url);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions: ', error)
    }
  };

  const fetchBalance = async () => {
    const url = "http://localhost:3001/transaction/balance";
    try {
      const response = await fetch(url);
      const data = await response.json();
      setBalance(data);
    } catch (error) {
      console.error('Error fetching transactions: ', error)
    }
  };

  useEffect(() => {

    fetchBalance();
    // if(transactions.length === 0)
    fetchTransaction();
    
  }, []);
 

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = `${process.env.REACT_APP_API_URL}/transaction`;

    const spentAmount = status === "spent" ? amount : "0";
    const receivedAmount = status === "received" ? amount : "0";


    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // Fixed 'header' to 'headers'
      body: JSON.stringify({ name, description, spentAmount, receivedAmount }) // Corrected body syntax
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        fetchTransaction();
        fetchBalance();
        // Reset form fields after successful submission
        setName('');               // <-- Reset name field
        setAmount('');             // <-- Reset amount field
        setStatus('spent');        // <-- Reset status field
        setDescription('');        // <-- Reset description field
        return response.json();
      })
      .then(json => {
        console.log('result', json);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function deleteTransaction(id){
    const url = `http://localhost:3001/transaction/${id}`;

    fetch(url, {
      method: 'DELETE',
    })
      .then(response => {
        if(!response.ok){
          throw new Error('Network response was not ok');
        }
        //remove the transaction from the front end 
        setTransactions(transactions.filter(transaction => transaction._id !== id));
        fetchBalance(); // update the balance after deletion
      })
      .catch(error => {
        console.error('Error: ', error);
      });
  }



  const handleAmountChange = (ev) => {
    console.log(ev.target.value);
    setAmount(ev.target.value)
  }


  return (
<div className="card"> 
      <main>
        <h1>Rs {balance}<span>.00</span></h1>
        <form onSubmit={addNewTransaction}>
          <div className='basic'>
            <input type="text"
              value={name}
              onChange={ev => setName(ev.target.value)}
              placeholder={'Zomato'} />
            <input type='text'
              value={amount}
              onChange={handleAmountChange}
              placeholder='600'/>
            <select value={status} onChange={ev => setStatus(ev.target.value)}>
              <option value="spent">Spent</option>
              <option value="received">Received</option>
            </select>
          </div>
          <div className='description'>
            <input type="text" placeholder={'Description'}
              value={description}
              onChange={ev => setDescription(ev.target.value)} />
          </div>
          <button type='submit'>Add new Transaction</button>
          
        </form>

        <div className='transactions'>
  {transactions.map((transaction) => (
    <div className='transaction' key={transaction._id}>
      <div className='left'>
        <div className='name'>{transaction.name}</div>
        <div className='description'>{transaction.description}</div>
      </div>
      <div className='right'>
        <div className='price' style={{ color: transaction.spentAmount > 0 ? 'red' : 'green' }}>
          {transaction.spentAmount > 0 ? `- Rs ${transaction.spentAmount}` : `+ Rs ${transaction.receivedAmount}`}
        </div>
        <div className='datetime'>{transaction.createdAt}</div>
        <button onClick={() => deleteTransaction(transaction._id)} className='delete-button'>
          Delete
        </button>
      </div>
    </div>
  ))}
</div>
      </main>
    </div>  
  );
}

export default App;
