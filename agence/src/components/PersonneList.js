import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Layout } from './Layout';
import axios from 'axios';
import { API_URL } from '../constants/constants';

export const PersonneList = () => {
    let emptyPersonne = {
        id: null,
        firstname: '',
        lastname: '',
        image: null,
        age: 0,
        address: "",
        feu:0
    };

    const cols = [
        { field: 'firstname', header: 'Nom' },
        { field: 'lastname', header: 'Prénom(s)' },
        { field: 'age', header: 'Age' },
        { field: 'address', header: 'Adresse' }
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const [personnes, setPersonnes] = useState(null);
    const [personneDialog, setPersonneDialog] = useState(false);
    const [deletePersonneDialog, setDeletePersonneDialog] = useState(false);
    const [deletePersonnesDialog, setDeletePersonnesDialog] = useState(false);
    const [personne, setPersonne] = useState(emptyPersonne);
    const [selectedPersonnes, setselectedPersonnes] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        if(localStorage.getItem('access_token') === null){                   
            window.location.href = '/login'
        }
        else{
         (async () => {
           try {
            const token = localStorage.getItem('access_token')
             const {data} = await axios.get(   
                            API_URL + 'personne/', {
                            headers: {
                                Authorization: `Bearer ${token}`
                                }}
                           );
             setPersonnes(data);
          } catch (e) {
            console.log('not auth'+ e)
          }
         })()};
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const openNew = () => {
        setPersonne(emptyPersonne);
        setSubmitted(false);
        setPersonneDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPersonneDialog(false);
    };

    const hidedeletePersonneDialog = () => {
        setDeletePersonneDialog(false);
    };

    const hidedeletePersonnesDialog = () => {
        setDeletePersonnesDialog(false);
    };

    const savePersonne = () => {
        setSubmitted(true);

        if (personne.firstname.trim()) {
            let _personnes = [...personnes];
            let _personne = { ...personne };

            if (personne.id) {
                const index = findIndexById(personne.id);

                _personnes[index] = personne;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'personne Updated', life: 3000 });
            } else {
                _personne.id = createId();
                _personne.image = 'personne-placeholder.svg';
                _personnes.push(_personne);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'personne Created', life: 3000 });
            }

            setPersonnes(_personnes);
            setPersonneDialog(false);
            setPersonne(emptyPersonne);
        }
    };

    const editPersonne = (personne) => {
        setPersonne({ ...personne });
        setPersonneDialog(true);
    };

    const confirmDeletePersonne = (personne) => {
        setPersonne(personne);
        setDeletePersonneDialog(true);
    };

    const deletePersonne = () => {
        let _personnes = personnes.filter((val) => val.id !== personne.id);

        setPersonnes(_personnes);
        setDeletePersonneDialog(false);
        setPersonne(emptyPersonne);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'personne Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < personnes.length; i++) {
            if (personnes[i].id === id) {
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

                doc.autoTable(exportColumns, personnes);
                doc.save('personnes.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(personnes);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'personnes');
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
        setDeletePersonnesDialog(true);
    };

    const deleteselectedPersonnes = () => {
        let _personnes = personne.filter((val) => !selectedPersonnes.includes(val));

        setPersonnes(_personnes);
        setDeletePersonnesDialog(false);
        setselectedPersonnes(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _personne = { ...personne };

        _personne['feu'] = e.value;
        setPersonne(_personne);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _personne = { ...personne };

        _personne[`${name}`] = val;

        setPersonne(_personne);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _personne = { ...personne };

        _personne[`${name}`] = val;

        setPersonne(_personne);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPersonnes || !selectedPersonnes.length} />
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
        return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />;
    };

    const ageBodyTemplate = (rowData) => {
        return formatCurrency(rowData.age);
    };

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editPersonne(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeletePersonne(rowData)} />
            </React.Fragment>
        );
    };

    const getSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Products</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const personneDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={savePersonne} />
        </React.Fragment>
    );
    const deletePersonneDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hidedeletePersonneDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deletePersonne} />
        </React.Fragment>
    );
    const deletePersonnesDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hidedeletePersonnesDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteselectedPersonnes} />
        </React.Fragment>
    );

    return (
        <Layout>
            <div>
                <Toast ref={toast} />
                <div className="card">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={personnes} selection={selectedPersonnes} onSelectionChange={(e) => setselectedPersonnes(e.value)}
                            dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                        <Column selectionMode="multiple" exportable={false}></Column>
                        <Column field="id" header="Code" sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="firstname" header="Nom" sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="lastname" header="Prénom" sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="image" header="Image" body={imageBodyTemplate}></Column>
                        <Column field="age" header="age" body={ageBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="age" header="Age" sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="address" header="Adresse" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="feu" header="Vivant" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                    </DataTable>
                </div>

                <Dialog visible={personneDialog} style={{ width: '32vw' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={personneDialogFooter} onHide={hideDialog}>
                    {personne.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${personne.image}`} alt={personne.image} className="product-image block m-auto pb-3" />}
                    
                    <div className='grid'>
                        <div className="col">
                            <label htmlFor="name" className="font-bold">
                                Nom
                            </label>
                            <InputText id="name" value={personne.firstname} onChange={(e) => onInputChange(e, 'firstname')} required autoFocus className={classNames({ 'p-invalid': submitted && !personne.firstname })} />
                            {submitted && !personne.firstname && <small className="p-error">Le champs est requis.</small>}
                        </div>
                        <div className="col">
                            <label htmlFor="name" className="font-bold">
                                Prénom(s)
                            </label>
                            <InputText id="name" value={personne.lastname} onChange={(e) => onInputChange(e, 'lastname')} required autoFocus className={classNames({ 'p-invalid': submitted && !personne.lastname })} />
                            {submitted && !personne.lastname && <small className="p-error">Le champs est requis.</small>}
                        </div>
                    </div>
                    

                    <div className="field">
                        <label className="mb-3 font-bold">Feu</label>
                        <div className="formgrid grid">
                            <div className="field-radiobutton col-6">
                                <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={personne.feu === 1} />
                                <label htmlFor="category1">Vivant(e)</label>
                            </div>
                            <div className="field-radiobutton col-6">
                                <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={personne.feu === 0} />
                                <label htmlFor="category2">Mort(e)</label>
                            </div>
                        </div>
                    </div>

                    <div className="grid">
                        <div className="field col">
                            <label htmlFor="age" className="font-bold">
                                Age
                            </label>
                            <InputNumber id="age" value={personne.age} onValueChange={(e) => onInputNumberChange(e, 'age')} mode="currency" currency="USD" locale="en-US" />
                        </div>
                        <div className="field col">
                            <label htmlFor="address" className="font-bold">
                                Adresse
                            </label>
                            <InputNumber id="address" value={personne.address} onValueChange={(e) => onInputNumberChange(e, 'address')} />
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={deletePersonneDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deletePersonneDialogFooter} onHide={hidedeletePersonneDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {personne && (
                            <span>
                                Voulez vous vraimment supprimer <b>{personne.firstname}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deletePersonnesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deletePersonnesDialogFooter} onHide={hidedeletePersonnesDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {personne && <span>Voulez vous vraimment supprimer la personne séléctionnée(s) ?</span>}
                    </div>
                </Dialog>
            </div>
        </Layout>
    );
}