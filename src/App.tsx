import { useState, useEffect } from "react";
import * as C from "./App.styles";
import { Item } from "./types/Item";
import { items } from "./data/items";
import { Livro } from "./types/livro";
import { categories } from "./data/categories";
import { getCurrentMonth, filterListByMonth } from "./helpers/dateFilter";
import { TableArea } from "./components/TableArea";
import { InfoArea } from "./components/InfoArea";
import { InputArea } from "./components/InputArea";
import api from "./services/api";
function App() {
  const [list, setList] = useState(items);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [filteredList, setFilteredList] = useState<Item[]>([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [livros, setLivros] = useState<Livro[]>([]);
  useEffect(() => {
    setFilteredList(filterListByMonth(list, currentMonth));
  }, [list, currentMonth]);

  useEffect(() => {
    async function carregarLivros() {
      try {
        const response = await api.get("/api/livros/"); // exemplo de rota
        console.log(response);
        setLivros(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    }

    carregarLivros();
  }, []);

  useEffect(() => {
    let incomeCount = 0;
    let expenseCount = 0;

    for (let i in filteredList) {
      if (categories[filteredList[i].category].expense) {
        expenseCount += filteredList[i].value;
      } else {
        incomeCount += filteredList[i].value;
      }
    }

    setIncome(incomeCount);
    setExpense(expenseCount);
  }, [filteredList]);

  const handleMonthChange = (newMonth: string) => {
    setCurrentMonth(newMonth);
  };

  const handleAddItem = (item: Item) => {
    let newList = [...list];
    newList.push(item);
    setList(newList);
  };

  return (
    <C.Container>
      <C.Header>
        <C.HeaderText>Sistema Financeiro</C.HeaderText>
      </C.Header>
      <C.Body>
        <InfoArea
          onMonthChange={handleMonthChange}
          currentMonth={currentMonth}
          income={income}
          expense={expense}
        />

        <InputArea onAdd={handleAddItem} />
        <TableArea list={filteredList} />

        <div>
          <h1>Lista de Livros Normais</h1>
          <ul>
            {livros.map((livro: Livro) => (
              <li key={livro.id}>
                <h2>{livro.titulo}</h2>
                <h3>{livro.autor}</h3>
                <h4>{livro.publicado_em}</h4>
              </li>
            ))}
          </ul>
        </div>
      </C.Body>
    </C.Container>
  );
}

export default App;
