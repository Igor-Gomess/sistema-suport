import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import {FiPlusCircle} from 'react-icons/fi';
import './new.css';
import {AuthContext} from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';
import {toast} from 'react-toastify';
import {useHistory, useParams} from 'react-router-dom';

export default function New(){

    const {id} = useParams();
    const history = useHistory();

    const [customers, setCustomers] = useState([]);
    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customerSelected, setCustomerSelected] = useState(0);

    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');

    const [idCustomer, setIdCustomer] = useState(false);

    const {user} = useContext(AuthContext);

    useEffect(()=>{
      async function loadCustomers(){
        await firebase.firestore().collection('customers')
        .get()
        .then((snapshot)=>{
           let lista = []; 

           snapshot.forEach((doc)=>{
            lista.push({
                id: doc.id,
                nomeFantasia: doc.data().nomeFantasia
            })
           })

           if(lista.length === 0){
            console.log('NENHUMA EMPRESA ENCONTRADA!');
            setCustomers([{id: '1', nomeFantasia: 'FREELA'}]);
            setLoadCustomers(false);
            return;
           }

           setCustomers(lista);
           setLoadCustomers(false);

           if(id){
            loadId(lista);
           }

        })
        .catch((error)=>{
           console.log('DEU ALGUM ERRO!!!', error);
           setLoadCustomers(false);
           setCustomers([{id: '1', nomeFantasia: ''}]);
        })
      }  
      loadCustomers();
    }, []);

    // Editar chamado
    async function loadId(lista){
        await firebase.firestore().collection('chamados').doc(id)
        .get()
        .then((snapshot)=>{
           setAssunto(snapshot.data().assunto);
           setStatus(snapshot.data().status);
           setComplemento(snapshot.data().complemento);

           let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
           setCustomerSelected(index);
           setIdCustomer(true);
        })
        .catch((error)=>{
          console.log('ERRO NO ID PASSADO: ', error);  
          setIdCustomer(false);
        })
    } //Fim editar chamado

    async function handleRegister(event){
        event.preventDefault();  

        if(idCustomer){
          await firebase.firestore().collection('chamados').doc(id)
          .update({
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid
          })
          .then(()=>{
            toast.success('Chamado editado com sucesso!');
            setCustomerSelected(0);
            setComplemento('');
            history.push('/dashboard');
          })
          .catch((error)=>{
            toast.error('Ops, erro ao registrar, tente mais tarde.');
            console.log(error)
          })
          return;
        }
        
        await firebase.firestore().collection('chamados')
        .add({
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid
        })
        .then(()=>{
           toast.success('Chamado criado com sucesso!');
           setComplemento('');
           setCustomerSelected(0);
           history.push('/dashboard');
        })
        .catch((error)=>{
            toast.error('Ops, erro ao registrar, tente mais tarde.');
           console.log(error); 
        })
    }

    // Chamado quando troca o assunto
    function handleChangeSelect(event){
        setAssunto(event.target.value);        
    }

    // Chamado quando troca o status
    function handleOptionChange(event){
        setStatus(event.target.value);        
    }

    // Chamado quando troca de cliente
    function handleChangeCustomers(event){
    //    console.log('INDEX DO CLIENTE SELECIONADO: ', event.target.value); 
    //    console.log('Cliente selecionado ', customers[event.target.value]);
       setCustomerSelected(event.target.value);
    }

    return (
        <div>
            <Header/>

            <div className='content'>
                <Title name="Novo chamado">
                  <FiPlusCircle size={25}/>  
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                     <label>Cliente</label>

                        {loadCustomers ? (
                           <input type="text" disabled={true} value="Carregando clientes ..."/> 
                        ) : (
                            <select value={customerSelected} onChange={handleChangeCustomers}>
                            {customers.map((item,index)=>{
                              return(
                                <option key={item.id} value={index}>
                                    {item.nomeFantasia}
                                </option>
                              )  
                            })}                        
                        </select>
                        )}

                        

                       <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Tecnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                            <div className='status'>
                               <input type="radio" name="radio" value="Aberto" onChange={handleOptionChange} checked={status === 'Aberto'}/>
                                <span>Em Aberto</span>

                                <input type="radio" name="radio" value="Progresso" onChange={handleOptionChange} checked={status === 'Progresso'}/>
                                <span>Progresso</span>

                                <input type="radio" name="radio" value="Atendido" onChange={handleOptionChange} checked={status === 'Atendido'}/>
                                <span>Atendido</span>
                            </div>  

                        <label>Complemento</label>
                        <textarea type="text" placeholder='Descreva seu problema (opcional).' value={complemento} onChange={ (event) => setComplemento(event.target.value)}/>   

                        <button type='submit'>Registrar</button>           
                    </form> 
                </div>
            </div>
        </div>
    )
}