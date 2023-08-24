import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { History, IHistory } from "../components/History";
import { db } from "../config/firebase";
import ReactPaginate from "react-paginate";

const shuffle = (array: any[]) => {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


export const Main = () => {

  
  const [historiesList, setHistoriesList] = useState<IHistory[] | null>(null);
  const historyRef = collection(db, "History");

  const getHistories = async () => {
    const data = await getDocs(historyRef);
    setHistoriesList(
      shuffle(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as IHistory[])
    );
  };



  const [pageNumber, setPageNumber] = useState(0);
  const historiesPerPage = 5;
  const pagesVisited = pageNumber * historiesPerPage;


  const displayHistories = (historiesList || [])
  .slice(pagesVisited, pagesVisited + historiesPerPage)
  .map((history) => {
    return <History history={history} setHistoriesList={setHistoriesList}/>;
  });
    
  const pageCount = Math.ceil((historiesList || []).length / historiesPerPage);

  const changePage = ({ selected } : any) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    getHistories();
  }, []);

  return (
    <div>
      {displayHistories}
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        pageClassName={"invisible"}
        containerClassName={"max-w-lg container mx-auto flex py-3 justify-between items-center"}
        previousLinkClassName={"bg-yellow-600 py-2 px-4 mx-2 rounded text-white hover:bg-yellow-500"}
        nextLinkClassName={"bg-yellow-600 py-2 px-4 mx-2 rounded text-white hover:bg-yellow-500"}
        activeClassName={"object-none"}

      />;
    </div>
  );
};
