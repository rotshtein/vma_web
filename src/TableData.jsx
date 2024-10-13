import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TableData = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    fetchData()
  }, []);

  const fetchData = async () => {
    axios.get('http://localhost:8000/v1/vmas/all/serials') // Replace with your API URL
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  // Handle row click for multi-select
  const handleRowClick = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
    handleCloseContextMenu();
  };

  // Handle right-click for context menu
  const handleRightClick = (event, id) => {
    event.preventDefault();
    setContextMenu({
      position: { x: event.pageX, y: event.pageY },
      rowId: id,
    });
  };

  const handleOpen = () => {
    selectedRows.map( (id) => console.log(id));
  }

  const handleCloseContextMenu = () => {
    setContextMenu(null);
    console.log('Context menu closed');
  };

  return (
    <div class="container mt-5">
      <h1>API Data Table</h1>
      <div class="row">
        <button type="button" class="btn btn-primary container text-center" onClick={fetchData}>Refresh Data</button>
        <br />
        <div style={{maxHeight: '400px', overflowY: "auto"}} >
          <table  class="table table-bordered  multi-column-table" >
            <thead>
              <tr>
                <th>Serial</th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
              {data.map(item => (
                <tr
                  key={item} 
                  onClick={() => handleRowClick(item)}
                  onContextMenu={(event) => handleRightClick(event, item)}
                  className={selectedRows.includes(item) ? 'selected' : ''}
                >
                  <td>{item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    

      {/* Context menu logic (optional implementation) */}
      {contextMenu && (
        <ul
          className="context-menu"
          style={{
            top: `${contextMenu.position.y}px`,
            left: `${contextMenu.position.x}px`,
            position: 'absolute',
            backgroundColor: 'white',
            border: '1px solid black',
            listStyle: 'none',
            padding: '10px',
            zIndex: 100,
          }}
        >
          <li onClick={handleOpen}>Open</li>
          <li onClick={handleCloseContextMenu}>Close</li>
        </ul>
      )}
    </div>
  );
};

export default TableData;
