import './App.css';
import { useEffect, useState } from 'react';

const backendUrl = 'http://localhost:1338'

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      fetch(backendUrl+'/files/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {

        })
        .catch((error) => {
        });
    }
  };
  const handleDelete = (fileName) => {
    console.log('DELETING FILE',fileName)
    fetch(backendUrl+`/files/delete/${fileName}`, {
      method: 'DELETE',
    })
    .then((response) => {
      if (response.status === 200) {
        setFiles((prevFileList) => prevFileList.filter((file) => file !== fileName));
      }
    })
    .catch((error) => {
      console.error('Error deleting file: ', error);
    });
  };

  
  const deletefile = (fileName) => {
    console.log('DELETING FILE',fileName)
    fetch(backendUrl+`/files/delete/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Set the content type to JSON
      },
      body:JSON.stringify({fileName})
    })
    .then((response) => {
      if (response.status === 200) {
        setFiles((prevFileList) => prevFileList.filter((file) => file !== fileName));
      }
    })
    .catch((error) => {
      console.error('Error deleting file: ', error);
    });
  };

  useEffect(()=>{
    fetch('http://localhost:1338/files/list').then(res=>res.json()).then(data=>{
      setFiles(data)
    })
  })
  return (
    <div className="App">
      <br />
      <div>
        <input type='file' onChange={handleFileChange}/>
        <button onClick={handleUpload}>Upload</button>
      </div>
      <br />
      <div>
        Files
      </div>
      <div>
        <ol>
          {files.map((file,i)=>{
            return <li key={i}>{file} <button onClick={() => deletefile(file)}>Delete</button></li>
          })}
        </ol>
      </div>
    </div>
  );
}

export default App;
