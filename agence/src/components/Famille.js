import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Layout } from './Layout';
import axios from 'axios';
import { API_URL } from '../constants/constants';
import { FileUpload } from 'primereact/fileupload';

export const Famille = () => {
    let emptyFamille = {
        id: null,
        firstname: '',
        lastname: '',
        contact: "",
        address: "",
        eglise: 1,
        image_url: null
    };

    const cols = [
        { field: 'firstname', header: 'Nom' },
        { field: 'lastname', header: 'Prénom(s)' },
        { field: 'contact', header: 'Contact' },
        { field: 'address', header: 'Adresse' }
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const [familles, setFamilles] = useState(null);
    const [familleDialog, setFamilleDialog] = useState(false);
    const [deletefamilleDialog, setDeletefamilleDialog] = useState(false);
    const [deletefamillesDialog, setDeletefamillesDialog] = useState(false);
    const [famille, setFamille] = useState(emptyFamille);
    const [selectedfamilles, setSelectedfamilles] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [eglise, setEglise] = useState(null);
    const [selectedEglise, setSelectedEglise] = useState(null);

    const [filterValue, setFilterValue] = useState('');
    const filterInputRef = useRef();

    useEffect(() => {
        if(localStorage.getItem('access_token') === null){                   
            window.location.href = '/login'
        }
        else{

         (async () => {
           try {
            const token = localStorage.getItem('access_token')
             const {data} = await axios.get(   
                            API_URL + 'famille/', {
                            headers: {
                                Authorization: `Bearer ${token}`
                                }}
                           );
            const eglises = await axios.get(   
                            API_URL + 'eglise/', {
                            headers: {
                                Authorization: `Bearer ${token}`
                                }}
                            );
            setEglise(eglises.data);
            setFamilles(data);
          } catch (e) {
            console.log('not auth'+ e)
          }
         })()};

    }, []);

    const selectedEgliseTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const egliseOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    }

    const filterTemplate = (options) => {
        let {filterOptions} = options;
    
        return (
            <div className="flex gap-2">
                <InputText value={filterValue} ref={filterInputRef} onChange={(e) => myFilterFunction(e, filterOptions)} />
                <Button label="Reset" onClick={() => myResetFunction(filterOptions)} />
            </div>
        )
    }
    
    const myResetFunction = (options) => {
        setFilterValue('');
        options.reset();
        filterInputRef && filterInputRef.current.focus()
    }
    
    const myFilterFunction = (event, options) => {
        let _filterValue = event.target.value;
        setFilterValue(_filterValue);
        options.filter(event);
    }
    
    const setEgliseId = (e) => {
        setSelectedEglise(e.target.value);
        
    }

    const openNew = () => {
        setFamille(emptyFamille);
        setSubmitted(false);
        setFamilleDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setFamilleDialog(false);
    };

    const hidedeletefamilleDialog = () => {
        setDeletefamilleDialog(false);
    };

    const hidedeletefamillesDialog = () => {
        setDeletefamillesDialog(false);
    };

    const savefamille =  () => {
        setSubmitted(true);

        const token = localStorage.getItem("access_token");

        if (famille.firstname.trim()) {
            let _familles = [...familles];
            let _famille = { ...famille };

            if(selectedEglise !== null){
                famille.eglise = selectedEglise.id
            }
            if (famille.id) {
                const index = findIndexById(famille.id);

                _familles[index] = famille;
                axios.put(API_URL+"famille/"+famille.id +"/",famille, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }}).then(res => {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'famille Updated', life: 3000 });
                    }).catch( e => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'erreur d\'enregistrement ' + e.config, life: 3000 });
                });

            } else {


                let form_data = new FormData();
                if (famille.image_url)
                    form_data.append("image_url", famille.image_url, famille.image_url.name);
                form_data.append("firstname", famille.firstname);
                form_data.append("lastname", famille.lastname);
                form_data.append("address", famille.address);
                form_data.append("contact", famille.contact);
                form_data.append("eglise", famille.eglise);


                axios.post(API_URL+"famille/",form_data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }}).then(res => {
                        _famille.id = res.data.id;
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'famille Created', life: 3000 });
                }).catch( e => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'erreur d\'enregistrement ' + e.config, life: 3000 });
                });

                _famille.image = 'famille-placeholder.svg';
                _familles.push(_famille);
               
            }

            
            setFamilles(_familles);
            setFamilleDialog(false);
            setFamille(emptyFamille);
            setSelectedEglise(null);
        }
    };

    const editfamille = (famille) => {
        setFamille({ ...famille });
        setFamilleDialog(true);
    };

    const confirmDeletefamille = (famille) => {
        setFamille(famille);
        setDeletefamilleDialog(true);
    };

    const deletefamille = () => {
        let _familles = familles.filter((val) => val.id !== famille.id);
        const token = localStorage.getItem("access_token");

        setFamilles(_familles);
        setDeletefamilleDialog(false);
        setFamille(emptyFamille);
        axios.delete(API_URL+"famille/"+famille.id +"/", {
            headers: {
                Authorization: `Bearer ${token}`
            }}).then(res => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'famille deleted', life: 3000 });
            }).catch( e => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'erreur d\'enregistrement ' + e.config, life: 3000 });
        });

    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < familles.length; i++) {
            if (familles[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, familles);
                doc.save('familles.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(familles);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'familles');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletefamillesDialog(true);
    };

    const deleteselectedfamilles = () => {
        let _familles = famille.filter((val) => !selectedfamilles.includes(val));

        setFamilles(_familles);
        setDeletefamillesDialog(false);
        setSelectedfamilles(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _famille = { ...famille };

        _famille['feu'] = e.value;
        setFamille(_famille);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _famille = { ...famille };

        _famille[`${name}`] = val;

        setFamille(_famille);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedfamilles || !selectedfamilles.length} />
            </div>
        );
    };

     const rightToolbarTemplate = () => {
        return (
        <>
            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
        </>
        );
    };
    const imageBodyTemplate = (rowData) => {
        if(rowData.image_url !== null){
            
            return <img src={rowData.image_url} alt={rowData.image_url} className="shadow-2 border-round" style={{ width: '64px' }} />;
        }
        else{
            return <img src="/assets/logo192.png" alt="avatar" className="shadow-2 border-round" style={{ width: '64px' }} />;
        }    
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editfamille(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeletefamille(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Liste des familles</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Taper un nom de famille..." />
            </span>
        </div>
    );
    const familleDialogFooter = (
        <React.Fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Enregistrer" icon="pi pi-check" onClick={savefamille} />
        </React.Fragment>
    );
    const deletefamilleDialogFooter = (
        <React.Fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hidedeletefamilleDialog} />
            <Button label="Confirmer" icon="pi pi-check" severity="danger" onClick={deletefamille} />
        </React.Fragment>
    );
    const deletefamillesDialogFooter = (
        <React.Fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hidedeletefamillesDialog} />
            <Button label="Confirmer" icon="pi pi-check" severity="danger" onClick={deleteselectedfamilles} />
        </React.Fragment>
    );
    const invoiceUploadHandler = ({files}) => {
        const [file] = files;
        famille.image_url = file
    };

    return (
        <Layout>
            <div>
                <Toast ref={toast} />
                <div className="card">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={familles} selection={selectedfamilles} onSelectionChange={(e) => setSelectedfamilles(e.value)}
                            dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                        <Column selectionMode="multiple" exportable={false}></Column>
                        <Column field="image_url" header="Photo" body={imageBodyTemplate}></Column>
                        <Column field="firstname" header="Nom" sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="lastname" header="Prénom" sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="address" header="Adresse" sortable style={{ minWidth: '12rem' }}></Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                    </DataTable>
                </div>

                <Dialog visible={familleDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Famille" modal className="p-fluid" footer={familleDialogFooter} onHide={hideDialog}>                    
                    
                    <div className="card flex justify-content-center">
                        <label htmlFor="name" className="font-bold">
                            Nom de l'église
                        </label>
                        <Dropdown value={selectedEglise} onChange={setEgliseId} options={eglise} optionLabel="name" placeholder="Choisissez un nom de famille" 
                ilter valueTemplate={selectedEgliseTemplate} itemTemplate={egliseOptionTemplate} className="w-full md:w-14rem" filter filterTemplate={filterTemplate} />
                    </div>

                    <div className="field">
                        <label htmlFor="name" className="font-bold">
                            Nom
                        </label>
                        <InputText id="firstname" value={famille.firstname} onChange={(e) => onInputChange(e, 'firstname')} required autoFocus className={classNames({ 'p-invalid': submitted && !famille.firstname })} />
                        {submitted && !famille.firstname && <small className="p-error">Le champs est requis.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="name" className="font-bold">
                            Prénom(s)
                        </label>
                        <InputText id="lastname" value={famille.lastname} onChange={(e) => onInputChange(e, 'lastname')} required autoFocus className={classNames({ 'p-invalid': submitted && !famille.lastname })} />
                        {submitted && !famille.firstname && <small className="p-error">Le champs est requis.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="contact" className="font-bold">
                            Contact
                        </label>
                        <InputText id="contact" value={famille.contact} onChange={(e) => onInputChange(e, 'contact')} required autoFocus className={classNames({ 'p-invalid': submitted && !famille.contact })} />
                        {submitted && !famille.contact && <small className="p-error">Le champs est requis.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="name" className="font-bold">
                            Adresse
                        </label>
                        <InputText id="address" value={famille.address} onChange={(e) => onInputChange(e, 'address')} required autoFocus className={classNames({ 'p-invalid': submitted && !famille.address })} />
                        {submitted && !famille.address && <small className="p-error">Le champs est requis.</small>}
                    </div>

                    <div className="card">
            
                        <FileUpload 
                            name="demo[]" 
                            multiple accept="image/*"                             
                            uploadHandler={invoiceUploadHandler}
                            customUpload
                            maxFileSize={1000000} 
                            auto={true}
                            emptyTemplate={<p className="m-0">Importer l'image de la famille</p>} />

                    </div>

                </Dialog>

                <Dialog visible={deletefamilleDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deletefamilleDialogFooter} onHide={hidedeletefamilleDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {famille && (
                            <span>
                                Voulez vous vraiment supprimer <b>{famille.firstname}  {famille.lastname}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deletefamillesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deletefamillesDialogFooter} onHide={hidedeletefamillesDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {famille && <span> Voulez vous vraiment supprimer la famille séléctionnée</span>}
                    </div>
                </Dialog>
            </div>
        </Layout>
    );
}