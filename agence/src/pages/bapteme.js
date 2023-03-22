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
import { InputTextarea } from 'primereact/inputtextarea';
import { Layout } from '../components/Layout';
import axios from 'axios';
import { API_URL } from '../constants/constants';

export const Bapteme = () => {
    let emptyBapteme = {
        id: null,
        name: '',
        description: '',
        eglise: 1
    };

    const cols = [
        { field: 'name', header: 'Promotion' },
        { field: 'description', header: 'Description' },
        { field: 'eglise', header: 'Eglise' },
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const [baptemes, setBaptemes] = useState(null);
    const [baptemeDialog, setBaptemeDialog] = useState(false);
    const [deletebaptemeDialog, setDeleteBaptemeDialog] = useState(false);
    const [deletebaptemesDialog, setDeleteBaptemesDialog] = useState(false);
    const [bapteme, setBapteme] = useState(emptyBapteme);
    const [selectedBaptemes, setSelectedBaptemes] = useState(null);
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
                            API_URL + 'bapteme/', {
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
            setBaptemes(data);
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
        console.log(e.target.value);
        
    }

    const openNew = () => {
        setBapteme(emptyBapteme);
        setSubmitted(false);
        setBaptemeDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setBaptemeDialog(false);
    };

    const hidedeletebaptemeDialog = () => {
        setDeleteBaptemeDialog(false);
    };

    const hidedeletebaptemesDialog = () => {
        setDeleteBaptemesDialog(false);
    };

    const saveBapteme =  () => {
        setSubmitted(true);

        const token = localStorage.getItem("access_token");

        if (bapteme.name.trim()) {
            let _baptemes = [...baptemes];
            let _bapteme = { ...bapteme };

            if(selectedEglise !== null){
                bapteme.eglise = selectedEglise.id
            }
            if (bapteme.id) {
                const index = findIndexById(bapteme.id);

                _baptemes[index] = bapteme;
                axios.put(API_URL+"bapteme/"+bapteme.id +"/",bapteme, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }}).then(res => {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'bapteme Updated', life: 3000 });
                    }).catch( e => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'erreur d\'enregistrement ' + e.config, life: 3000 });
                });

            } else {
                _baptemes.push(_bapteme);

                axios.post(API_URL+"bapteme/",bapteme, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }}).then(res => {
                        console.log(res.data.id)
                        _bapteme.id = res.data.id;
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'bapteme Created', life: 3000 });
                }).catch( e => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'erreur d\'enregistrement ' + e.config, life: 3000 });
                });
               
            }

            
            setBaptemes(_baptemes);
            setBaptemeDialog(false);
            setBapteme(emptyBapteme);
            setSelectedEglise(null);
        }
    };

    const editbapteme = (bapteme) => {
        setBapteme({ ...bapteme });
        setBaptemeDialog(true);
    };

    const confirmDeletebapteme = (bapteme) => {
        setBapteme(bapteme);
        setDeleteBaptemeDialog(true);
    };

    const deletebapteme = () => {
        let _baptemes = baptemes.filter((val) => val.id !== bapteme.id);

        setBaptemes(_baptemes);
        setDeleteBaptemeDialog(false);
        setBapteme(emptyBapteme);
        const token = localStorage.getItem('access_token')

        axios.delete(API_URL+"bapteme/"+bapteme.id +"/", {
            headers: {
                Authorization: `Bearer ${token}`
            }}).then(res => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'bapteme deleted', life: 3000 });
            }).catch( e => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'erreur d\'enregistrement ' + e.config, life: 3000 });
        });

    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < baptemes.length; i++) {
            if (baptemes[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };


    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, baptemes);
                doc.save('personnes.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(baptemes);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'baptemes');
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
        setDeleteBaptemesDialog(true);
    };

    const deleteselectedBaptemes = () => {
        let _baptemes = bapteme.filter((val) => !selectedBaptemes.includes(val));

        setBaptemes(_baptemes);
        setDeleteBaptemesDialog(false);
        setSelectedBaptemes(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _bapteme = { ...bapteme };

        _bapteme[`${name}`] = val;

        setBapteme(_bapteme);
    };


    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedBaptemes || !selectedBaptemes.length} />
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
  

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editbapteme(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeletebapteme(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Liste des baptemes</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Taper quelque mots..." />
            </span>
        </div>
    );
    const baptemeDialogFooter = (
        <React.Fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Enregistrer" icon="pi pi-check" onClick={saveBapteme} />
        </React.Fragment>
    );
    const deletebaptemeDialogFooter = (
        <React.Fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hidedeletebaptemeDialog} />
            <Button label="Confirmer" icon="pi pi-check" severity="danger" onClick={deletebapteme} />
        </React.Fragment>
    );
    const deletebaptemesDialogFooter = (
        <React.Fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hidedeletebaptemesDialog} />
            <Button label="Confirmer" icon="pi pi-check" severity="danger" onClick={deleteselectedBaptemes} />
        </React.Fragment>
    );

    return (
        <Layout>
            <div>
                <Toast ref={toast} />
                <div className="card">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={baptemes} selection={selectedBaptemes} onSelectionChange={(e) => setSelectedBaptemes(e.value)}
                            dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                        <Column selectionMode="multiple" exportable={false}></Column>
                        <Column field="name" header="Promotion" sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="description" header="Description" sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="eglise" header="Eglise" sortable style={{ minWidth: '12rem' }}></Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                    </DataTable>
                </div>

                <Dialog visible={baptemeDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="bapteme" modal className="p-fluid" footer={baptemeDialogFooter} onHide={hideDialog}>                    
                    
                    <div className="card flex justify-content-center">
                        <label htmlFor="name" className="font-bold">
                            Nom de l'église
                        </label>
                        <Dropdown value={selectedEglise} onChange={setEgliseId} options={eglise} optionLabel="name" placeholder="Choisissez un nom de bapteme" 
                ilter valueTemplate={selectedEgliseTemplate} itemTemplate={egliseOptionTemplate} className="w-full md:w-14rem" filter filterTemplate={filterTemplate} />
                    </div>

                    <div className="field">
                        <label htmlFor="name" className="font-bold">
                            Nom du Promotion
                        </label>
                        <InputText id="firstname" value={bapteme.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !bapteme.name })} />
                        {submitted && !bapteme.name && <small className="p-error">Le champs est requis.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="name" className="font-bold">
                           Description
                        </label>

                        <InputTextarea id="lastname" value={bapteme.description} onChange={(e) => onInputChange(e, 'description')} required autoFocus className={classNames({ 'p-invalid': submitted && !bapteme.description })} />
                        {submitted && !bapteme.description && <small className="p-error">Le champs est requis.</small>}
                    </div>
                    
                </Dialog>

                <Dialog visible={deletebaptemeDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deletebaptemeDialogFooter} onHide={hidedeletebaptemeDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {bapteme && (
                            <span>
                                Voulez vous vraiment supprimer <b>{bapteme.firstname}  {bapteme.lastname}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deletebaptemesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deletebaptemesDialogFooter} onHide={hidedeletebaptemesDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {bapteme && <span> Voulez vous vraiment supprimer la bapteme séléctionnée</span>}
                    </div>
                </Dialog>
            </div>
        </Layout>
    );
}