import React from 'react';

export const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="text-lg font-bold">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export const Loading = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="spinner"></div>
    </div>
  );
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className,
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'sm' ? 'btn-sm' : '';

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${className || ''}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = '' }) => {
  return <div className={`card ${className}`}>{children}</div>;
};

export const Badge = ({ children, variant = 'primary' }) => {
  return <span className={`badge badge-${variant}`}>{children}</span>;
};

export const FormInput = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-input"
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export const FormTextarea = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-textarea"
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export const FormSelect = ({
  label,
  value,
  onChange,
  options,
  error,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <select value={value} onChange={onChange} className="form-select" {...props}>
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export const Modal = ({ isOpen, title, children, onClose, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && <div className="p-6 border-t flex gap-2 justify-end">{footer}</div>}
      </div>
    </div>
  );
};

export const Table = ({ columns, data, actions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8">
                No data found
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td>
                    <div className="flex gap-2">
                      {actions(row).map((action, idx) => (
                        <button
                          key={idx}
                          onClick={action.onClick}
                          className={`btn btn-sm ${action.className || 'btn-outline'}`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
