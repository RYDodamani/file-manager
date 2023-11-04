import './App.css';
import { useEffect, useState } from 'react';
import useFetch from './hooks/useFetch';

const backendUrl = {
  // url:'http://localhost:1338',
  url:'http://mynodeapp.hopto.org'
}

function App() {
  const [files, setFiles] = useState([]);
  const [s3files, setS3files] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedS3File, setSelectedS3File] = useState(null)

  const ff = useFetch(backendUrl.url+'/files/list');
  useEffect(()=>{
    setFiles(ff)
  },[ff])

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      console.log('New file',selectedFile)
      fetch(backendUrl.url+'/files/upload', {
        method: 'POST',
        body: formData,
      })
      .then((response) => {
        console.log('Upload success',response);
        setFiles(ff=>[...ff,selectedFile.name])
      })
      .catch((error) => {
        console.log('Upload err',error)
      });
    }
  };
  const handleFileChangeS3 = (event) => {
    const file = event.target.files[0];
    setSelectedS3File(file);
  };

  const handleUploadS3 = () => {
    if (selectedS3File) {
      const formData = new FormData();
      formData.append('file', selectedS3File);

      fetch(backendUrl.url+'/files/uploadToS3', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          fetch(backendUrl.url+'/files/listS3')
          .then(res=>res.json())
          .then(data=>{
            setS3files(data.Contents)
          })
          .catch(e=>{

          })
        })
        .catch((error) => {
        });
    }
  };
  const handleDelete = (fileName) => {
    console.log('DELETING FILE',fileName)
    fetch(backendUrl.url+`/files/delete/${fileName}`, {
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
    fetch(backendUrl.url+`/files/delete/`, {
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
  const deleteS3File = (fileName) => {
    console.log('DELETING FILE S3',fileName)
    fetch(backendUrl.url+`/files/deleteS3/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Set the content type to JSON
      },
      body:JSON.stringify({fileName})
    })
    .then((response) => {
      if (response.status === 200) {
        setS3files((prevFileList) => prevFileList.filter((file) => file.Key !== 'fileuploads/'+fileName));
      }
    })
    .catch((error) => {
      console.error('Error deleting file: ', error);
    });
  };

  const {Contents} = useFetch(backendUrl.url+'/files/listS3');
  // console.log('Fetched s3 files',Contents)
  useEffect(()=>{
    setS3files(old=>{
      if(!Contents) return old
      return Contents
    })
  },[Contents])
  useEffect(()=>{
    console.log('S3 List',s3files)
  },[s3files])
  return (
    <div className="App">
      <br /><br />
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
            return <li key={i}>{file} &nbsp;
            <a
              href={backendUrl.url+`/files/download/${file}`}
              download
            >
            Download
          </a> &nbsp; <button onClick={() => deletefile(file)}>Delete</button></li>
          })}
        </ol>
      </div>
      <br />
      <br /><br />
      <div>
        <input type='file' onChange={handleFileChangeS3}/>
        <button onClick={handleUploadS3}>Upload</button>
      </div>
      <div>
        S3 Files
      </div>
      <div>
        <ol>
          {s3files.map((file,i)=>{
            // console.log('S3',file.Key.split('/'))
            const filekey = file.Key.split('/');
            const fileName = filekey[filekey.length-1];
            return <li key={i}>{fileName} &nbsp;
            <a
              href={backendUrl.url+`/files/downloadS3/${fileName}`}
              download
            >
            Download
          </a> &nbsp; <button onClick={() => deleteS3File(fileName)}>Delete</button></li>
          })}
        </ol>
      </div>
    </div>
  );
}

export default App;
