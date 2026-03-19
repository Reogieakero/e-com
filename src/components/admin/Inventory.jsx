import React from 'react';
import styles from './Inventory.module.css';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiFilter } from 'react-icons/fi';

const Inventory = () => {
  // Mock data for your ukay-ukay listings
  const stock = [
    { id: 'UK-001', name: 'Vintage Denim Jacket', category: 'Outerwear', price: 850, stock: 1, status: 'In Stock' },
    { id: 'UK-002', name: 'Graphic Band Tee (L)', category: 'Tops', price: 350, stock: 0, status: 'Sold' },
    { id: 'UK-003', name: 'High-Waist Corduroy Pants', category: 'Bottoms', price: 550, stock: 1, status: 'In Stock' },
    { id: 'UK-004', name: 'Puffer Vest Navy', category: 'Outerwear', price: 700, stock: 2, status: 'In Stock' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Inventory Management</h1>
          <p>Manage and track your ukay-ukay stock levels.</p>
        </div>
        <button className={styles.addBtn}>
          <FiPlus /> Add New Item
        </button>
      </header>

      <div className={styles.tableControls}>
        <div className={styles.searchBox}>
          <FiSearch />
          <input type="text" placeholder="Search by item name or SKU..." />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((item) => (
              <tr key={item.id}>
                <td className={styles.sku}>{item.id}</td>
                <td className={styles.itemName}>{item.name}</td>
                <td>{item.category}</td>
                <td className={styles.price}>₱{item.price}</td>
                <td>{item.stock}</td>
                <td>
                  <span className={item.status === 'Sold' ? styles.statusSold : styles.statusStock}>
                    {item.status}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button className={styles.editBtn} title="Edit"><FiEdit2 /></button>
                  <button className={styles.deleteBtn} title="Delete"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;