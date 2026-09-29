import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  density?: 'comfortable' | 'compact';
  headerStyle?: React.CSSProperties;
}

export function Table<T extends { id: string }>({
  columns,
  data,
  loading = false,
  onRowClick,
  emptyMessage = 'No data available',
  density = 'comfortable',
  headerStyle,
}: TableProps<T>) {
  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ color: '#6B7881' }}>Loading...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#6B7881', backgroundColor: '#FFFFFF', border: '1px solid #C7BBAB', borderRadius: '8px' }}>
        {emptyMessage}
      </div>
    );
  }

  const cellPad = density === 'compact' ? '8px 12px' : '12px 16px';

  return (
    <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #C7BBAB', backgroundColor: '#FFFFFF' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
        <thead>
          <tr style={{ backgroundColor: headerStyle?.backgroundColor || '#97764D' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: cellPad,
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: headerStyle?.color || '#FFFFFF',
                  borderBottom: '1px solid #C7BBAB',
                  whiteSpace: 'nowrap',
                  ...headerStyle,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id || index}
              onClick={() => onRowClick?.(item)}
              onKeyDown={(e) => {
                if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onRowClick(item);
                }
              }}
              tabIndex={onRowClick ? 0 : undefined}
              style={{
                cursor: onRowClick ? 'pointer' : 'default',
                backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F2F0EB',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#E9E6E0';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  index % 2 === 0 ? '#FFFFFF' : '#F2F0EB';
              }}
              onFocus={(e) => {
                if (onRowClick) {
                  (e.currentTarget as HTMLElement).style.outline = '2px solid #97764D';
                  (e.currentTarget as HTMLElement).style.outlineOffset = '-2px';
                }
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLElement).style.outline = 'none';
              }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: cellPad,
                    borderBottom: '1px solid #E3DED6',
                    fontSize: '14px',
                    color: '#232D36',
                    textAlign: 'center',
                  }}
                >
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
