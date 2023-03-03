import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
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
import { API_URL, FEU, SEXE, SITUATIONFAMILIALE, STATUSFIDELE, STATUSMARIED } from '../constants/constants';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { DataTable } from 'primereact/datatable';


export const PersonneList = () => {
    let emptyPersonne = {
        id: null,
        image_url: null,
        firstname: '',
        lastname: '',
        age: 0,
        address: "",
        contact: '',
        is_maried: '',
        is_baptised:1,
        situation_familiale:"",
        feu:"",
        sexe:"",
        is_fidele: "",
        author: 2,
        baptheme:""

    };

    const cols = [
        { field: 'firstname', header: 'Nom' },
        { field: 'lastname', header: 'Prénom(s)' },
        { field: 'age', header: 'Age' },
        { field: 'address', header: 'Adresse' }
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, personneKey: col.field }));

    const [personnes, setPersonnes] = useState([]);
    const [personneDialog, setPersonneDialog] = useState(false);
    const [deletePersonneDialog, setDeletePersonneDialog] = useState(false);
    const [deletePersonnesDialog, setDeletePersonnesDialog] = useState(false);
    const [personne, setPersonne] = useState(emptyPersonne);
    const [selectedPersonnes, setselectedPersonnes] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);


    const [eglise, setEglise] = useState(null);
    const [selectedEglise, setSelectedEglise] = useState(null);
    const [famille, setFamille] = useState(null);
    const [selectedFamille, setSelectedFamille] = useState(null);
    const [baptheme, setBaptheme] = useState(null);
    const [selectedBaptheme, setSelectedBaptheme] = useState(null);
    const [selectedSituationFamiliale, setSelectedSituationFamiliale] = useState(null);

    const [selectedSexe, setSelectedSexe] = useState(null);
    const [selectedFeu, setSelectedFeu] = useState(null);
    const [selectedFidele, setSelectedFidele] = useState(null);
    const [selectedSituationMatrimoniale, setSelectedSituationMatrimoniale] = useState(null);

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
            const personne_list = await axios.get(   
                                API_URL + 'personne/', {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                    }}
                           );
            const eglises_list = await axios.get(   
                                API_URL + 'eglise/', {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                    }}
                            );
            const familles_list = await axios.get(   
                                API_URL + 'famille/', {
                                headers: {
                                    Authorization: `Bearer ${token}`
                            }}
            );
            const bapthemes_list = await axios.get(   
                                API_URL + 'bapteme/', {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }}
                            );
            const _familles_list = (familles_list?.data).reduce((acc, {id, firstname, lastname}) => {
                const name = firstname +" "+lastname;
                return [...acc, {id: id, name: name}]
            },[])
            setFamille(_familles_list);
            setBaptheme(bapthemes_list.data);
            setEglise(eglises_list.data);
            setPersonnes(personne_list.data);
          } catch (e) {
            console.log('not auth'+ e)
          }
         })()};
    }, []);

    const selectedTemplate = (option, props) => {
        if(option){
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }
        // if(option.name){
        //     return (
        //         <div className="flex align-items-center">
        //             <div>{option.name}</div>
        //         </div>
        //     );
        // }
        // else if(option.firstname){
        //     return (
        //         <div className="flex align-items-center">
        //             <div>{option.firstname} {option.lastname} </div>
        //         </div>
        //     );
        // }

        return <span>{props.placeholder}</span>;
    };

    const optionTemplate = (option) => {
        if(option){
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }
        // if(option.name){
        //     return (
        //         <div className="flex align-items-center">
        //             <div>{option.name}</div>
        //         </div>
        //     );
        // }
        // else if(option.firstname){
        //     return (
        //         <div className="flex align-items-center">
        //             <div>{option.firstname} {option.lastname} </div>
        //         </div>
        //     );
        // }
        
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

    const setFamilleId = (e) => {
        setSelectedFamille(e.target.value);
    }
    const setBapthemeId = (e) => {
        setSelectedBaptheme(e.target.value)
    }
    const setSituationFamilialeValueId = (e) => {
        setSelectedSituationFamiliale(e.value)
    }

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
        const token = localStorage.getItem("access_token");

        if (personne.firstname.trim()) {
            let _personnes = [...personnes];
            let _personne = { ...personne };

            if(selectedEglise !== null){
                personne.eglise = selectedEglise.id
            }

            if(selectedFamille !== null){
                personne.famille = selectedFamille.id
            }

            if(selectedBaptheme !== null){
                personne.baptheme = selectedBaptheme.id
            }
            if(selectedSituationFamiliale !== null){
                personne.situation_familiale = selectedSituationFamiliale
            }
            
            personne.is_fidele = selectedFidele !== null ? selectedFidele : null;
            personne.feu = selectedFeu !== null ? selectedFeu : null
            personne.is_maried = selectedSituationMatrimoniale !== null ? selectedSituationMatrimoniale : null
            personne.sexe = selectedSexe !== null ? selectedSexe : null


            if (personne.id) {
                const index = findIndexById(personne.id);
                _personnes[index] = personne;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'personne Updated', life: 3000 });
            } else {

                console.log(personne.image_url);
                let form_data = new FormData();
                if (personne.image_url)
                    form_data.append("image_url", personne.image_url, personne.image_url.name);
                form_data.append("firstname", personne.firstname);
                form_data.append("lastname", personne.lastname);
                form_data.append("age", personne.age);
                form_data.append("address", personne.address);
                form_data.append("contact", personne.contact);
                form_data.append("is_maried", personne.is_maried);

                form_data.append("is_baptised", personne.is_baptised);
                form_data.append("situation_familiale", personne.situation_familiale );
                form_data.append("feu", personne.feu);
                form_data.append("famille", personne.famille);
                form_data.append("eglise", personne.eglise);
                form_data.append("baptheme", personne.baptheme);

                form_data.append("sexe", personne.sexe);

                axios.post(API_URL+"personne/",form_data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }}).then(res => {
                        _personne.id = res.data.id;
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'personne Created', life: 3000 });
                }).catch( e => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'erreur d\'enregistrement ' + e.config, life: 3000 });
                });

                _personne.id = createId();
                _personne.image_url = 'personne-placeholder.svg';
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
            const workbook = { Sheets: { personne: worksheet }, SheetNames: ['personne'] };
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
                const personne = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(personne, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
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

    const onSexeValueChange = (e) => {
        let _personne = { ...personne };

        _personne['sexe'] = e.value;
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
            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} personne-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} personne-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} personne-pr-tooltip="PDF" />
        </>
        );
    };

    const image_urlBodyTemplate = (rowData) => {
        return <img src={`https://primefaces.org/cdn/primereact/image_urls/product/${rowData.image_url}`} alt={rowData.image_url} className="shadow-2 border-round" style={{ width: '64px' }} />;
    };

    const ageBodyTemplate = (rowData) => {
        return formatCurrency(rowData.age);
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editPersonne(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeletePersonne(rowData)} />
            </React.Fragment>
        );
    };
    const statusBodyTemplate = (rowData) => {
        return <span className={`product-badge status-${rowData.feu}`}>{rowData.feu === 1 ? "vivant(e)" : "mort(e)"}</span>;
    }

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


    const invoiceUploadHandler = ({files}) => {
        const [file] = files;
        // const fileReader = new FileReader();
        console.log(file);
        personne.image_url = file
        // fileReader.onload = (e) => {
        //     uploadInvoice(e.target.result);
        //     personne.image_url = e.target.result
        // };
        // fileReader.readAsDataURL(file);
    };
 

    // const uploadInvoice = async (invoiceFile) => {
    //     let formData = new FormData();
    //     formData.append('image_url', invoiceFile);
    
    //     const response = await fetch(`orders/${orderId}/uploadInvoiceFile`,
    //         {
    //             method: 'POST',
    //             body: formData
    //         },
    //     );
    // };

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
                        <Column field="image_url" header="Photo" body={image_urlBodyTemplate}></Column>
                        <Column field="firstname" header="Nom" sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="lastname" header="Prénom" sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="age" header="age" body={ageBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="address" header="Adresse" sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="contact" header="Contact" sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="is_maried" header="Marié" sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="is_baptised" header="Baptisé" sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="situation_familiale" header="Situation familiale" sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="contact" header="Contact" sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="feu" header="Vivant" body={statusBodyTemplate}  sortable style={{ minWidth: '12rem' }}></Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                    </DataTable>
                </div>

                <Dialog visible={personneDialog} style={{ width: '32vw' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Action sur les personnes" modal className="p-fluid" footer={personneDialogFooter} onHide={hideDialog}>
                    {personne.image_url && <img src={`https://primefaces.org/cdn/primereact/image_urls/product/${personne.image_url}`} alt={personne.image_url} className="product-image_url block m-auto pb-3" />}
                    
                    <div className="card flex justify-content-center">
                        <label htmlFor="name" className="font-bold">
                            Nom de l'église
                        </label>
                        <Dropdown value={selectedEglise} onChange={setEgliseId} options={eglise} optionLabel="name" placeholder="Choisissez un nom d'église" 
                ilter valueTemplate={selectedTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" filter filterTemplate={filterTemplate} />
                    </div>

                    <div className="card flex justify-content-center">
                        <label htmlFor="name" className="font-bold">
                            Nom de famille
                        </label>
                        <Dropdown value={selectedFamille} onChange={setFamilleId} options={famille} optionLabel="name" placeholder="Choisissez un nom de famille" 
                ilter valueTemplate={selectedTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" filter filterTemplate={filterTemplate} />
                    </div>

                    <div className="card flex justify-content-center">
                        <label htmlFor="name" className="font-bold">
                            Promotion baptise
                        </label>
                        <Dropdown value={selectedBaptheme} onChange={setBapthemeId} options={baptheme} optionLabel="name" placeholder="Choisissez un nom de promotion du baptise" 
                ilter valueTemplate={selectedTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" filter filterTemplate={filterTemplate} />
                    </div>
                    <div className="card flex justify-content-center">
                        <label htmlFor="name" className="font-bold">
                            Situation Familiale
                        </label>
                        <Dropdown value={selectedSituationFamiliale} onChange={setSituationFamilialeValueId} options={SITUATIONFAMILIALE} optionLabel="name" placeholder="Situation familiale" 
                ilter valueTemplate={selectedTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" filter filterTemplate={filterTemplate} />
                    </div>

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
                    <div className="grid">
                        <div className="field col">
                            <label htmlFor="age" className="font-bold">
                                Age
                            </label>
                            <InputNumber id="age" value={personne.age} onChange={(e) => onInputNumberChange(e, 'age')} />
                        </div>
                        <div className="field col">
                            <label htmlFor="address" className="font-bold">
                                Adresse
                            </label>
                            <InputText id="address" value={personne.address} onChange={(e) => onInputChange(e, 'address')} />
                        </div>
                    </div>
                    <div className='field'>
                        <div className="col">
                            <label htmlFor="name" className="font-bold">
                                Contact 
                            </label>
                            <InputText id="contact" value={personne.contact} onChange={(e) => onInputChange(e, 'contact')} required autoFocus className={classNames({ 'p-invalid': submitted && !personne.contact })} />
                            {submitted && !personne.contact && <small className="p-error">Le champs est requis.</small>}
                        </div>
                    </div>
                    <div className="card flex justify-content-center">
                        <label htmlFor="name" className="font-bold">
                            sexe
                        </label>
                        <Dropdown value={selectedSexe} onChange={(e) => {setSelectedSexe(e.value)}} options={SEXE} optionLabel="name" placeholder="Situation familiale" 
                ilter valueTemplate={selectedTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" filter filterTemplate={filterTemplate} />
                    </div>
          
                    <div className="card flex justify-content-center">
                        <label htmlFor="name" className="font-bold">
                            Situation matrimoniale
                        </label>
                        <Dropdown value={selectedSituationMatrimoniale} onChange={(e) => {setSelectedSituationMatrimoniale(e.value)}} options={STATUSMARIED} optionLabel="name" placeholder="Situation familiale" 
                ilter valueTemplate={selectedTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" filter filterTemplate={filterTemplate} />
                    </div>
                    <div className="card flex justify-content-center">
                        <label htmlFor="name" className="font-bold">
                            Fidélité par rapport à l'église
                        </label>
                        <Dropdown value={selectedFidele} onChange={(e) => {setSelectedFidele(e.value)}} options={STATUSFIDELE} optionLabel="name" placeholder="Situation familiale" 
                ilter valueTemplate={selectedTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" filter filterTemplate={filterTemplate} />
                    </div>

                    <div className="card flex justify-content-center">
                        <label htmlFor="name" className="font-bold">
                            Feu
                        </label>
                        <Dropdown value={selectedFeu} onChange={(e) => setSelectedFeu(e.value)} options={FEU} optionLabel="name" placeholder="Situation familiale" 
                ilter valueTemplate={selectedTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" filter filterTemplate={filterTemplate} />
                    </div>

                    

                    <div className="card">
            
                        <FileUpload 
                            name="demo[]" 
                            multiple accept="image/*"                             
                            uploadHandler={invoiceUploadHandler}
                            customUpload
                            maxFileSize={1000000} 
                            auto={true}
                            emptyTemplate={<p className="m-0">Importer l'image de la personne</p>} />

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