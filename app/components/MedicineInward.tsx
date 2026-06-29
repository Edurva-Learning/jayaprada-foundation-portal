'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, X, Search, Upload, 
  ChevronLeft, ChevronRight, Download, AlertTriangle, 
  Package, FileSpreadsheet, Pill, Clock, RefreshCw,
  Building, Phone, Eye, Pencil, Trash2, CheckCircle, XCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface Medicine {
  id: number;
  vendor_name: string;
  medicine_name: string;
  phone: string;
  category: string;
  quantity_ml_mg: number;
  price: number;
  manufacturer: string;
  manufacture_date: string;
  expiry_date: string;
  remarks: string;
  updated_on: string;
}

const MedicineInventory: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [searchMedicine, setSearchMedicine] = useState('');
  const [searchVendor, setSearchVendor] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<any[]>([]);
  const [importColumns, setImportColumns] = useState<string[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [previewPage, setPreviewPage] = useState(1);
  const [previewRowsPerPage] = useState(50);
  const [searchPreview, setSearchPreview] = useState('');
  const [excelRawData, setExcelRawData] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [validRows, setValidRows] = useState(0);
  const [invalidRows, setInvalidRows] = useState(0);
  const [importProgress, setImportProgress] = useState(0);

  const [formData, setFormData] = useState({
    vendor_name: '',
    medicine_name: '',
    phone: '',
    category: '',
    quantity_ml_mg: '',
    price: '',
    manufacturer: '',
    manufacture_date: '',
    expiry_date: '',
    remarks: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const categoryOptions = ['Tablet', 'Syrup', 'Capsule', 'Injection', 'Drops', 'Ointment', 'Inhaler', 'Patch', 'Other'];

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return dateString;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 5000);
  };

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/medicine-inventory`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMedicines(data);
      setFilteredMedicines(data);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error fetching medicines:', err);
      showError('Failed to fetch medicines. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchMedicine.trim() && !searchVendor.trim() && !searchPhone.trim()) {
      setFilteredMedicines(medicines);
      setCurrentPage(1);
      return;
    }

    try {
      setLoading(true);
      let filtered = [...medicines];
      
      if (searchMedicine.trim()) {
        const term = searchMedicine.toLowerCase().trim();
        filtered = filtered.filter(m => 
          m.medicine_name && m.medicine_name.toLowerCase().includes(term)
        );
      }
      
      if (searchVendor.trim()) {
        const term = searchVendor.toLowerCase().trim();
        filtered = filtered.filter(m => 
          m.vendor_name && m.vendor_name.toLowerCase().includes(term)
        );
      }
      
      if (searchPhone.trim()) {
        const term = searchPhone.trim();
        filtered = filtered.filter(m => 
          m.phone && m.phone.includes(term)
        );
      }
      
      setFilteredMedicines(filtered);
      setCurrentPage(1);
      
      if (filtered.length === 0) {
        showError('No medicines found matching your search criteria');
      }
    } catch (err) {
      console.error('Search error:', err);
      showError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchMedicine('');
    setSearchVendor('');
    setSearchPhone('');
    setFilteredMedicines(medicines);
    setCurrentPage(1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchMedicine || searchVendor || searchPhone) {
        handleSearch();
      } else {
        setFilteredMedicines(medicines);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchMedicine, searchVendor, searchPhone, medicines]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.medicine_name || !formData.vendor_name) {
      showError('Medicine name and vendor name are required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/medicine-inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor_name: formData.vendor_name,
          medicine_name: formData.medicine_name,
          phone: formData.phone || null,
          category: formData.category || null,
          quantity_ml_mg: formData.quantity_ml_mg ? parseFloat(formData.quantity_ml_mg) : null,
          price: formData.price ? parseFloat(formData.price) : null,
          manufacturer: formData.manufacturer || null,
          manufacture_date: formData.manufacture_date || null,
          expiry_date: formData.expiry_date || null,
          remarks: formData.remarks || null
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add');
      }

      await fetchMedicines();
      setIsAddModalOpen(false);
      resetForm();
      showSuccess('Medicine added successfully!');
    } catch (err) {
      console.error('Add error:', err);
      showError('Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setFormData({
      vendor_name: medicine.vendor_name || '',
      medicine_name: medicine.medicine_name || '',
      phone: medicine.phone || '',
      category: medicine.category || '',
      quantity_ml_mg: medicine.quantity_ml_mg?.toString() || '',
      price: medicine.price?.toString() || '',
      manufacturer: medicine.manufacturer || '',
      manufacture_date: formatDateForInput(medicine.manufacture_date),
      expiry_date: formatDateForInput(medicine.expiry_date),
      remarks: medicine.remarks || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicine) return;

    try {
      setLoading(true);
      const updateData: any = {};
      if (formData.vendor_name) updateData.vendor_name = formData.vendor_name;
      if (formData.medicine_name) updateData.medicine_name = formData.medicine_name;
      if (formData.phone) updateData.phone = formData.phone;
      if (formData.category) updateData.category = formData.category;
      if (formData.quantity_ml_mg) updateData.quantity_ml_mg = parseFloat(formData.quantity_ml_mg);
      if (formData.price) updateData.price = parseFloat(formData.price);
      if (formData.manufacturer) updateData.manufacturer = formData.manufacturer;
      if (formData.manufacture_date) updateData.manufacture_date = formData.manufacture_date;
      if (formData.expiry_date) updateData.expiry_date = formData.expiry_date;
      if (formData.remarks) updateData.remarks = formData.remarks;

      const response = await fetch(`${API_BASE_URL}/medicine-inventory/${selectedMedicine.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update');
      }

      await fetchMedicines();
      setIsEditModalOpen(false);
      resetForm();
      showSuccess('Medicine updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      showError('Failed to update medicine');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/medicine-inventory/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete');
      
      await fetchMedicines();
      showSuccess('Medicine deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      showError('Failed to delete medicine');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      vendor_name: '',
      medicine_name: '',
      phone: '',
      category: '',
      quantity_ml_mg: '',
      price: '',
      manufacturer: '',
      manufacture_date: '',
      expiry_date: '',
      remarks: ''
    });
    setSelectedMedicine(null);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setIsImportModalOpen(false);
    resetForm();
    setPreviewPage(1);
    setSearchPreview('');
    setImportProgress(0);
  };

  // Parse Excel date to YYYY-MM-DD format
  const parseExcelDate = (value: any): string => {
    if (!value) return '';

    if (value instanceof Date) {
      if (isNaN(value.getTime())) return '';
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    if (typeof value === 'number') {
      const date = new Date((value - 25569) * 86400 * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      if (year > 1900 && year < 2100) return `${year}-${month}-${day}`;
    }
    
    if (typeof value === 'string') {
      const cleaned = value.trim();
      if (cleaned.match(/^\d{4}-\d{2}-\d{2}$/)) return cleaned;
      const match = cleaned.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
      if (match) {
        return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
      }
    }
    
    return '';
  };

  // Main mapping function - preserves ALL data
  const mapExcelRowToMedicine = (row: any, index: number) => {
    const getValue = (keys: string[]): string => {
      for (const key of keys) {
        if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
          return String(row[key]).trim();
        }
        const lowerKey = key.toLowerCase();
        for (const colKey of Object.keys(row)) {
          if (colKey.toLowerCase() === lowerKey && row[colKey] !== undefined && row[colKey] !== null && row[colKey] !== '') {
            return String(row[colKey]).trim();
          }
        }
      }
      return '';
    };

    let quantityValue = getValue(['quantity_mL', 'quantity_ml', 'quantity_ml_mg', 'QUANTITY', 'Qty', 'Quantity', 'Stock']);
    
    if (quantityValue) {
      const numericMatch = quantityValue.match(/^([\d.]+)/);
      if (numericMatch) {
        quantityValue = numericMatch[1];
      }
    }

    // Preserve ALL original data
    const mappedData = {
      vendor_name: getValue(['vendor_name', 'VENDOR', 'Vendor', 'Vendor Name', 'Supplier']),
      medicine_name: getValue(['medicine_name', 'MEDICINE', 'Medicine', 'Medicine Name', 'Drug']),
      phone: getValue(['phone', 'PHONE', 'Phone', 'Mobile', 'Contact']),
      category: getValue(['category', 'CATEGORY', 'Category', 'Type']),
      quantity_ml_mg: quantityValue || '0',
      price: getValue(['price', 'PRICE', 'Price', 'Cost', 'Rate']) || '0',
      manufacturer: getValue(['manufacture', 'manufacturer', 'MANUFACTURER', 'Manufacturer', 'Manufacture', 'Brand']),
      manufacture_date: parseExcelDate(getValue(['manufacture_date', 'MFG DATE', 'Mfg Date', 'Manufacture Date', 'mfg_date'])),
      expiry_date: parseExcelDate(getValue(['expiry_date', 'EXP DATE', 'Exp Date', 'Expiry Date', 'exp_date'])),
      remarks: getValue(['remarks', 'REMARKS', 'Remarks', 'Notes'])
    };

    // Preserve ALL original columns
    const preservedRow = { ...row };
    
    return {
      mapped: mappedData,
      original: preservedRow,
      rowIndex: index + 1,
      isValid: !!(mappedData.medicine_name && mappedData.vendor_name)
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);
        
        console.log("📄 Total rows in Excel:", json.length);
        console.log("📋 All columns:", Object.keys(json[0] || {}));
        console.log("📝 First row data:", json[0]);
        console.log("🔍 Full data:", json);
        
        if (json.length === 0) {
          showError('No data found in Excel file');
          return;
        }

        const columns = Object.keys(json[0]);
        setImportColumns(columns);
        setTotalRows(json.length);
        setExcelRawData(json);
        
        // Map ALL rows
        const mappedResults = json.map((row, index) => mapExcelRowToMedicine(row, index));
        const mappedData = mappedResults.map(r => r.mapped);
        const validCount = mappedResults.filter(r => r.isValid).length;
        const invalidCount = mappedResults.filter(r => !r.isValid).length;
        
        setValidRows(validCount);
        setInvalidRows(invalidCount);
        setImportData(mappedData);
        setPreviewPage(1);
        
        console.log("✅ Mapped data:", mappedData);
        console.log(`✅ Valid rows: ${validCount}, Invalid rows: ${invalidCount}`);
        
        showSuccess(`✅ Loaded ${json.length} rows from Excel. ${validCount} valid, ${invalidCount} invalid. Please review before importing.`);
      } catch (error) {
        console.error("Error reading file:", error);
        showError('Failed to read Excel file: ' + (error as Error).message);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Get filtered preview data
  const getFilteredPreviewData = () => {
    if (!searchPreview.trim()) return importData;
    
    const term = searchPreview.toLowerCase().trim();
    return importData.filter(row => 
      (row.vendor_name && row.vendor_name.toLowerCase().includes(term)) ||
      (row.medicine_name && row.medicine_name.toLowerCase().includes(term)) ||
      (row.category && row.category.toLowerCase().includes(term)) ||
      (row.manufacturer && row.manufacturer.toLowerCase().includes(term)) ||
      (row.phone && row.phone.includes(term))
    );
  };

  // Get paginated preview data
  const getPaginatedPreviewData = () => {
    const filtered = getFilteredPreviewData();
    const startIndex = (previewPage - 1) * previewRowsPerPage;
    return filtered.slice(startIndex, startIndex + previewRowsPerPage);
  };

  // Get total preview pages
  const getTotalPreviewPages = () => {
    const filtered = getFilteredPreviewData();
    return Math.ceil(filtered.length / previewRowsPerPage);
  };

  const handleImportConfirm = async () => {
    if (importData.length === 0) {
      showError('No data to import');
      return;
    }

    const validRecords = importData.filter(m => m.medicine_name && m.vendor_name);
    
    if (validRecords.length === 0) {
      showError('No valid records to import. Please check your data.');
      return;
    }

    if (!confirm(`Are you sure you want to import ${validRecords.length} valid records out of ${importData.length} total rows?`)) {
      return;
    }

    setImportLoading(true);
    setImportProgress(0);
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    try {
      const batchSize = 100;
      const totalBatches = Math.ceil(validRecords.length / batchSize);
      
      for (let i = 0; i < validRecords.length; i += batchSize) {
        const batch = validRecords.slice(i, i + batchSize);
        
        for (const medicine of batch) {
          try {
            const response = await fetch(`${API_BASE_URL}/medicine-inventory`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(medicine)
            });
            
            if (response.ok) {
              successCount++;
            } else {
              const errorData = await response.json();
              errors.push(`${medicine.medicine_name || 'Unknown'}: ${errorData.error || 'Unknown error'}`);
              errorCount++;
            }
          } catch (err) {
            errors.push(`${medicine.medicine_name || 'Unknown'}: ${err}`);
            errorCount++;
          }
        }
        
        const progress = Math.round(((i + batch.length) / validRecords.length) * 100);
        setImportProgress(progress);
        console.log(`Import progress: ${progress}%`);
      }

      await fetchMedicines();
      
      if (successCount > 0) {
        showSuccess(`✅ Imported ${successCount} medicines successfully! ${errorCount > 0 ? `⚠️ ${errorCount} failed.` : ''}`);
      } else {
        showError(`❌ Import failed for all ${errorCount} records. Check console for details.`);
      }
      
      if (errors.length > 0) {
        console.error('Import errors:', errors);
      }
      
      setIsImportModalOpen(false);
      setImportFile(null);
      setImportData([]);
      setImportColumns([]);
      setExcelRawData([]);
      setSearchPreview('');
      setPreviewPage(1);
      setImportProgress(0);
      setTotalRows(0);
      setValidRows(0);
      setInvalidRows(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Import error:', err);
      showError('Import failed');
    } finally {
      setImportLoading(false);
    }
  };

  const handleExport = () => {
    if (filteredMedicines.length === 0) {
      showError('No data to export');
      return;
    }

    try {
      const exportData = filteredMedicines.map(m => ({
        'ID': m.id,
        'Vendor Name': m.vendor_name || '',
        'Medicine Name': m.medicine_name || '',
        'Phone': m.phone || '',
        'Category': m.category || '',
        'Quantity (ml/mg)': m.quantity_ml_mg || 0,
        'Price': m.price ? parseFloat(m.price as any) : 0,
        'Manufacturer': m.manufacturer || '',
        'Manufacture Date': formatDate(m.manufacture_date),
        'Expiry Date': formatDate(m.expiry_date),
        'Remarks': m.remarks || '',
        'Updated On': formatDate(m.updated_on)
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Medicine Inventory');
      
      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `Medicine_Inventory_${dateStr}.xlsx`);
      showSuccess('Export successful!');
    } catch (err) {
      console.error('Export error:', err);
      showError('Export failed');
    }
  };

  useEffect(() => {
    const total = Math.ceil(filteredMedicines.length / itemsPerPage);
    setTotalPages(total > 0 ? total : 1);
    if (currentPage > total) setCurrentPage(1);
  }, [filteredMedicines, itemsPerPage]);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMedicines.slice(startIndex, startIndex + itemsPerPage);
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const ModalWrapper = ({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] flex flex-col shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b bg-[#00b4d8] text-white rounded-t-lg">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="hover:opacity-80">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );

  const MessageDisplay = () => (
    <>
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md">
          {errorMessage}
        </div>
      )}
    </>
  );

  const MedicineForm = ({ isView = false }: { isView?: boolean }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name *</label>
        {isView ? (
          <p className="text-gray-900">{formData.vendor_name || '-'}</p>
        ) : (
          <input
            type="text"
            name="vendor_name"
            value={formData.vendor_name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#00b4d8] focus:outline-none"
            placeholder="Enter vendor name"
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name *</label>
        {isView ? (
          <p className="text-gray-900">{formData.medicine_name || '-'}</p>
        ) : (
          <input
            type="text"
            name="medicine_name"
            value={formData.medicine_name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#00b4d8] focus:outline-none"
            placeholder="Enter medicine name"
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        {isView ? (
          <p className="text-gray-900">{formData.phone || '-'}</p>
        ) : (
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#00b4d8] focus:outline-none"
            placeholder="Enter phone number"
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        {isView ? (
          <p className="text-gray-900">{formData.category || '-'}</p>
        ) : (
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#00b4d8] focus:outline-none"
          >
            <option value="">Select Category</option>
            {categoryOptions.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (ml/mg)</label>
        {isView ? (
          <p className="text-gray-900">{formData.quantity_ml_mg || '0'}</p>
        ) : (
          <input
            type="number"
            name="quantity_ml_mg"
            value={formData.quantity_ml_mg}
            onChange={handleInputChange}
            step="0.01"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#00b4d8] focus:outline-none"
            placeholder="Enter quantity"
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
        {isView ? (
          <p className="text-gray-900">{formData.price ? `₹${formData.price}` : '-'}</p>
        ) : (
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.01"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#00b4d8] focus:outline-none"
            placeholder="Enter price"
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
        {isView ? (
          <p className="text-gray-900">{formData.manufacturer || '-'}</p>
        ) : (
          <input
            type="text"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#00b4d8] focus:outline-none"
            placeholder="Enter manufacturer name"
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Manufacture Date</label>
        {isView ? (
          <p className="text-gray-900">{formatDate(formData.manufacture_date)}</p>
        ) : (
          <input
            type="date"
            name="manufacture_date"
            value={formData.manufacture_date}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#00b4d8] focus:outline-none"
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
        {isView ? (
          <p className="text-gray-900">{formatDate(formData.expiry_date)}</p>
        ) : (
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#00b4d8] focus:outline-none"
          />
        )}
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
        {isView ? (
          <p className="text-gray-900">{formData.remarks || '-'}</p>
        ) : (
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#00b4d8] focus:outline-none"
            placeholder="Enter remarks"
          />
        )}
      </div>
    </div>
  );

  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
        <div className="text-sm text-gray-600">
          Showing {filteredMedicines.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredMedicines.length)} of {filteredMedicines.length}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) pageNum = i + 1;
            else if (currentPage <= 3) pageNum = i + 1;
            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = currentPage - 2 + i;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 border rounded ${
                  pageNum === currentPage ? 'bg-[#00b4d8] text-white' : 'hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  const SummaryStats = () => {
    const total = medicines.length;
    const totalQuantity = medicines.reduce((sum, m) => sum + (m.quantity_ml_mg || 0), 0);
    const expired = medicines.filter(m => m.expiry_date && new Date(m.expiry_date) < new Date()).length;
    const expiringSoon = medicines.filter(m => {
      if (!m.expiry_date) return false;
      const expDate = new Date(m.expiry_date);
      const now = new Date();
      const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30;
    }).length;
    const lowStock = medicines.filter(m => (m.quantity_ml_mg || 0) <= 10).length;

    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Package className="text-blue-600" size={20} />
            <span className="text-sm text-blue-600 font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <Package className="text-green-600" size={20} />
            <span className="text-sm text-green-600 font-medium">Total Qty</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{totalQuantity}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-600" size={20} />
            <span className="text-sm text-red-600 font-medium">Expired</span>
          </div>
          <p className="text-2xl font-bold text-red-700">{expired}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <Clock className="text-yellow-600" size={20} />
            <span className="text-sm text-yellow-600 font-medium">Expiring Soon</span>
          </div>
          <p className="text-2xl font-bold text-yellow-700">{expiringSoon}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-orange-600" size={20} />
            <span className="text-sm text-orange-600 font-medium">Low Stock</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">{lowStock}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <MessageDisplay />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Pill className="text-[#00b4d8]" />
          Medicine Inventory
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm"
          >
            <Upload size={18} /> Import
          </button>
          <button
            onClick={handleExport}
            disabled={filteredMedicines.length === 0}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
          >
            <Download size={18} /> Export
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-[#00b4d8] text-white px-4 py-2 rounded-md hover:bg-[#0097b2] transition-colors text-sm"
          >
            <Plus size={18} /> Add Inventory
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <SummaryStats />

      {/* Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by Medicine Name..."
            value={searchMedicine}
            onChange={(e) => setSearchMedicine(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-[#00b4d8] focus:outline-none text-sm"
          />
        </div>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by Vendor Name..."
            value={searchVendor}
            onChange={(e) => setSearchVendor(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-[#00b4d8] focus:outline-none text-sm"
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by Phone..."
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-[#00b4d8] focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Search Buttons */}
      <div className="flex gap-2 mb-4">
        <button 
          onClick={handleSearch} 
          className="px-4 py-2 bg-[#00b4d8] text-white rounded-md hover:bg-[#0097b2] transition-colors text-sm flex items-center gap-2"
        >
          <Search size={16} /> Search
        </button>
        <button 
          onClick={resetSearch} 
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm flex items-center gap-2"
        >
          <RefreshCw size={16} /> Reset
        </button>
        <span className="text-sm text-gray-500 flex items-center ml-2">
          {filteredMedicines.length} results found
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#90e0ef] rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00b4d8]"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#caf0f8] text-[#0077b6] sticky top-0 z-10">
                    <tr className="border-b border-[#90e0ef]">
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">#</th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Medicine Name</th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Vendor Name</th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Phone</th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Category</th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Qty (ml/mg)</th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Price</th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Manufacturer</th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Mfg Date</th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Expiry Date</th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Remarks</th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Updated On</th>
                      <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {getCurrentPageItems().map((medicine, index) => {
                      const isExpired = medicine.expiry_date && new Date(medicine.expiry_date) < new Date();
                      const isExpiringSoon = medicine.expiry_date && !isExpired && 
                        new Date(medicine.expiry_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                      
                      return (
                        <tr key={medicine.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td className="px-4 py-3 text-center font-medium text-gray-800 whitespace-nowrap">{medicine.medicine_name || '-'}</td>
                          <td className="px-4 py-3 text-center text-gray-700 whitespace-nowrap">{medicine.vendor_name || '-'}</td>
                          <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap">{medicine.phone || '-'}</td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              medicine.category ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {medicine.category || 'Not Set'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <span className={(medicine.quantity_ml_mg || 0) <= 10 ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                              {medicine.quantity_ml_mg || 0}
                            </span>
                            {(medicine.quantity_ml_mg || 0) <= 10 && (
                              <AlertTriangle className="inline ml-1 text-red-500" size={14} />
                            )}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700 whitespace-nowrap">
                            {medicine.price ? `₹${parseFloat(medicine.price as any).toFixed(2)}` : '-'}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700 whitespace-nowrap">{medicine.manufacturer || '-'}</td>
                          <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap">{formatDate(medicine.manufacture_date)}</td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              isExpired ? 'bg-red-100 text-red-700' :
                              isExpiringSoon ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Valid'}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDate(medicine.expiry_date)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-gray-600 max-w-[150px] truncate" title={medicine.remarks || ''}>
                            {medicine.remarks || '-'}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-500 text-xs whitespace-nowrap">{formatDate(medicine.updated_on)}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleView(medicine)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="View"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleEdit(medicine)}
                                className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                title="Edit"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(medicine.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {filteredMedicines.length === 0 && (
              <div className="text-center py-8 text-gray-500">No medicines found</div>
            )}
            {filteredMedicines.length > 0 && <Pagination />}
          </>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <ModalWrapper title="Add New Inventory" onClose={closeModals}>
          <form onSubmit={handleAdd}>
            <MedicineForm />
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button type="button" onClick={closeModals} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-[#00b4d8] text-white rounded-md hover:bg-[#0097b2]">
                {loading ? 'Saving...' : 'Add Inventory'}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedMedicine && (
        <ModalWrapper title="Edit Medicine" onClose={closeModals}>
          <form onSubmit={handleUpdate}>
            <MedicineForm />
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button type="button" onClick={closeModals} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-[#00b4d8] text-white rounded-md hover:bg-[#0097b2]">
                {loading ? 'Updating...' : 'Update Medicine'}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedMedicine && (
        <ModalWrapper title="Medicine Details" onClose={closeModals}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500">ID</p>
              <p className="font-medium">{selectedMedicine.id}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500">Medicine Name</p>
              <p className="font-medium">{selectedMedicine.medicine_name || '-'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500">Vendor Name</p>
              <p className="font-medium">{selectedMedicine.vendor_name || '-'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500">Phone</p>
              <p className="font-medium">{selectedMedicine.phone || '-'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500">Category</p>
              <p className="font-medium">{selectedMedicine.category || '-'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500">Quantity (ml/mg)</p>
              <p className="font-medium">{selectedMedicine.quantity_ml_mg || 0}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500">Price</p>
              <p className="font-medium">{selectedMedicine.price ? `₹${selectedMedicine.price.toFixed(2)}` : '-'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500">Manufacturer</p>
              <p className="font-medium">{selectedMedicine.manufacturer || '-'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500">Manufacture Date</p>
              <p className="font-medium">{formatDate(selectedMedicine.manufacture_date)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500">Expiry Date</p>
              <p className="font-medium">{formatDate(selectedMedicine.expiry_date)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded md:col-span-2">
              <p className="text-xs text-gray-500">Remarks</p>
              <p className="font-medium">{selectedMedicine.remarks || '-'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded md:col-span-2">
              <p className="text-xs text-gray-500">Updated On</p>
              <p className="font-medium">{formatDate(selectedMedicine.updated_on)}</p>
            </div>
          </div>
          <div className="flex justify-end mt-6 pt-4 border-t">
            <button onClick={closeModals} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
              Close
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <ModalWrapper title="Import Medicines from Excel" onClose={closeModals}>
          <div>
            {importData.length === 0 ? (
              <div className="text-center py-8">
                <FileSpreadsheet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                <p className="text-gray-500 text-sm">
                  Select an Excel file (.xlsx, .xls) or CSV to import.
                </p>
                <div className="mt-4 text-left bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Supported columns:</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li><strong>vendor_name</strong> - Vendor, Vendor Name, Supplier</li>
                    <li><strong>medicine_name</strong> - Medicine, Medicine Name, Drug</li>
                    <li><strong>phone</strong> - Phone, Mobile, Contact</li>
                    <li><strong>category</strong> - Category, Type</li>
                    <li><strong>quantity_mL</strong> - Quantity, Qty, Stock (supports mL and mg)</li>
                    <li><strong>price</strong> - Price, Cost, Rate</li>
                    <li><strong>manufacture</strong> - Manufacturer, Manufacture, Brand</li>
                    <li><strong>manufacture_date</strong> - MFG DATE, Mfg Date, Manufacture Date</li>
                    <li><strong>expiry_date</strong> - EXP DATE, Exp Date, Expiry Date</li>
                    <li><strong>remarks</strong> - Remarks, Notes</li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                {/* Import Stats */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="bg-blue-50 px-4 py-2 rounded-lg">
                      <span className="text-sm text-gray-600">Total Rows:</span>
                      <span className="ml-2 font-bold text-blue-700">{totalRows || importData.length}</span>
                    </div>
                    <div className="bg-green-50 px-4 py-2 rounded-lg">
                      <span className="text-sm text-gray-600">Valid Rows:</span>
                      <span className="ml-2 font-bold text-green-700">{validRows}</span>
                    </div>
                    <div className="bg-red-50 px-4 py-2 rounded-lg">
                      <span className="text-sm text-gray-600">Invalid Rows:</span>
                      <span className="ml-2 font-bold text-red-700">{invalidRows}</span>
                    </div>
                    <div className="bg-purple-50 px-4 py-2 rounded-lg">
                      <span className="text-sm text-gray-600">Columns:</span>
                      <span className="ml-2 font-bold text-purple-700">{importColumns.length}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setImportData([]);
                        setImportColumns([]);
                        setExcelRawData([]);
                        setSearchPreview('');
                        setPreviewPage(1);
                        setTotalRows(0);
                        setValidRows(0);
                        setInvalidRows(0);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Clear Data
                    </button>
                    <button
                      onClick={() => {
                        setImportData([]);
                        setImportColumns([]);
                        setExcelRawData([]);
                        setSearchPreview('');
                        setPreviewPage(1);
                        setTotalRows(0);
                        setValidRows(0);
                        setInvalidRows(0);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                        setIsImportModalOpen(false);
                      }}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Search Preview */}
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search in preview data (searches all columns)..."
                    value={searchPreview}
                    onChange={(e) => {
                      setSearchPreview(e.target.value);
                      setPreviewPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-[#00b4d8] focus:outline-none text-sm"
                  />
                  {searchPreview && (
                    <button
                      onClick={() => {
                        setSearchPreview('');
                        setPreviewPage(1);
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Preview Table */}
                <div className="overflow-x-auto border rounded-lg">
                  <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">#</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Vendor</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Medicine</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Phone</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Category</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Qty (ml/mg)</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Price</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Manufacturer</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Mfg Date</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Expiry Date</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaginatedPreviewData().map((row, idx) => {
                          const isValid = row.medicine_name && row.vendor_name;
                          const globalIndex = (previewPage - 1) * previewRowsPerPage + idx + 1;
                          return (
                            <tr key={globalIndex} className={`border-t ${!isValid ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                              <td className="px-3 py-2">{globalIndex}</td>
                              <td className={`px-3 py-2 ${!row.vendor_name ? 'text-red-500' : ''}`}>
                                {row.vendor_name || <span className="italic">Missing</span>}
                              </td>
                              <td className={`px-3 py-2 ${!row.medicine_name ? 'text-red-500' : ''}`}>
                                {row.medicine_name || <span className="italic">Missing</span>}
                              </td>
                              <td className="px-3 py-2">{row.phone || '-'}</td>
                              <td className="px-3 py-2">{row.category || '-'}</td>
                              <td className="px-3 py-2">{row.quantity_ml_mg || '0'}</td>
                              <td className="px-3 py-2">{row.price || '0'}</td>
                              <td className="px-3 py-2">{row.manufacturer || '-'}</td>
                              <td className="px-3 py-2">{row.manufacture_date || '-'}</td>
                              <td className="px-3 py-2">{row.expiry_date || '-'}</td>
                              <td className="px-3 py-2">
                                {isValid ? (
                                  <span className="text-green-600 flex items-center gap-1">
                                    <CheckCircle size={14} /> Valid
                                  </span>
                                ) : (
                                  <span className="text-red-600 flex items-center gap-1">
                                    <XCircle size={14} /> Missing required fields
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Preview Pagination */}
                {getTotalPreviewPages() > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white mt-2 rounded-lg">
                    <div className="text-sm text-gray-600">
                      Showing {(previewPage - 1) * previewRowsPerPage + 1} to{' '}
                      {Math.min(previewPage * previewRowsPerPage, getFilteredPreviewData().length)} of{' '}
                      {getFilteredPreviewData().length}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPreviewPage(p => Math.max(1, p - 1))}
                        disabled={previewPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="px-3 py-1 border rounded bg-[#00b4d8] text-white">
                        {previewPage} / {getTotalPreviewPages()}
                      </span>
                      <button
                        onClick={() => setPreviewPage(p => Math.min(getTotalPreviewPages(), p + 1))}
                        disabled={previewPage === getTotalPreviewPages()}
                        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Import Progress */}
                {importLoading && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00b4d8]"></div>
                      <span className="text-sm text-gray-600">Importing... {importProgress}% complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-[#00b4d8] h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${importProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Processing {validRows} valid records in batches of 100
                    </p>
                  </div>
                )}

                {/* Column Information */}
                <div className="mt-4 text-xs text-gray-500">
                  <p>📋 Columns detected: {importColumns.join(', ')}</p>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button onClick={closeModals} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
              Cancel
            </button>
            {importData.length > 0 && !importLoading && (
              <button
                onClick={handleImportConfirm}
                disabled={validRows === 0}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                  validRows === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <Upload size={16} />
                Import {validRows} Valid Records
                {invalidRows > 0 && ` (${invalidRows} invalid skipped)`}
              </button>
            )}
            {importLoading && (
              <button
                disabled
                className="px-4 py-2 bg-gray-400 text-white rounded-md flex items-center gap-2 cursor-not-allowed"
              >
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Importing... {importProgress}%
              </button>
            )}
          </div>
        </ModalWrapper>
      )}
    </div>
  );
};

export default MedicineInventory;