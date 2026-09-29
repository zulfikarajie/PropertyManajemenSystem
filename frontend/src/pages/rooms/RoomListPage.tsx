import { useState, useMemo, useEffect, useRef } from 'react';
import { Pencil, Trash2, Filter, X, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { roomService } from '@/services/roomService';
import { roomTypeService } from '@/services/roomTypeService';
import { Table } from '@/components/shared/Table';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Modal } from '@/components/shared/Modal';
import { RoomForm } from '@/components/shared/RoomForm';
import { Room } from '@/types/auth.types';
import '../../styles/reservation-list.css';

type RoomModal = { mode: 'create' } | { mode: 'edit'; id: string } | null;

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = { active: 'Active', inactive: 'Inactive', maintenance: 'Maintenance' };
  return labels[status] || status;
};

export default function RoomListPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [modal, setModal] = useState<RoomModal>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ type: string; status: string }>({ type: 'all', status: 'all' });
  const filterWrapRef = useRef<HTMLDivElement>(null);
  const service = roomService;
  const typeService = roomTypeService;
  const closeModal = () => setModal(null);

  const allRooms = service.getAll();
  const allTypes = typeService.getAll();

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    ...allTypes.map((t) => ({ value: t.id, label: t.name })),
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' },
  ];

  const FILTER_CATEGORIES = [
    { key: 'type', label: 'Room Type', options: typeOptions },
    { key: 'status', label: 'Status', options: statusOptions },
  ];

  const filteredRooms = useMemo(() => {
    return allRooms.filter((room) => {
      const matchesSearch = room.roomNumber.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || room.roomTypeId === typeFilter;
      const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [allRooms, search, typeFilter, statusFilter]);

  const activeFilterCount = (typeFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);

  const applyFilters = () => {
    setTypeFilter(draft.type);
    setStatusFilter(draft.status);
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setDraft({ type: 'all', status: 'all' });
    setTypeFilter('all');
    setStatusFilter('all');
    setActiveCategory(null);
  };

  const closeFilter = () => {
    setFilterOpen(false);
    setActiveCategory(null);
  };

  useEffect(() => {
    if (!filterOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (filterWrapRef.current && !filterWrapRef.current.contains(e.target as Node)) {
        closeFilter();
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [filterOpen]);

  const getTypeLabel = (roomTypeId: string) => {
    const type = allTypes.find((t) => t.id === roomTypeId);
    return type?.name || 'Unknown';
  };

  const columns = [
    {
      key: 'roomNumber',
      header: 'Room Number',
      render: (item: Room) => (
        <span>{item.roomNumber}</span>
      ),
    },
    {
      key: 'roomType',
      header: 'Type',
      render: (item: Room) => <span>{getTypeLabel(item.roomTypeId)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Room) => (
        <Badge variant={item.status === 'active' ? 'success' : item.status === 'maintenance' ? 'warning' : 'danger'}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Room) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            type="button"
            aria-label={`Edit room ${item.roomNumber}`}
            onClick={() => setModal({ mode: 'edit', id: item.id })}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #2563EB', backgroundColor: '#2563EB', color: '#FFFFFF', cursor: 'pointer', transition: 'background-color 150ms ease, color 150ms ease, border-color 150ms ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#000000'; e.currentTarget.style.borderColor = '#000000'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2563EB'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderColor = '#2563EB'; }}
          >
            <Pencil size={14} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={`Delete room ${item.roomNumber}`}
            onClick={() => setDeleteConfirm(item.id)}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #DC2626', backgroundColor: '#DC2626', color: '#FFFFFF', cursor: 'pointer', transition: 'background-color 150ms ease, color 150ms ease, border-color 150ms ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#000000'; e.currentTarget.style.borderColor = '#000000'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#DC2626'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderColor = '#DC2626'; }}
          >
            <Trash2 size={14} aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 'var(--space-xl, 20px)', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#232D36', fontFamily: 'var(--font-family-sans)', margin: 0 }}>Rooms</h1>
          <p style={{ color: '#6B7881', margin: '4px 0 0 0', fontSize: '14px' }}>Manage hotel rooms</p>
        </div>
        <Button onClick={() => setModal({ mode: 'create' })}>+ New Room</Button>
      </div>

      <div className="res-toolbar" role="search" style={{ marginBottom: '20px' }}>
        <div className="res-toolbar__filterwrap" ref={filterWrapRef}>
          <Button
            onClick={() => (filterOpen ? closeFilter() : setFilterOpen(true))}
            aria-expanded={filterOpen}
            aria-controls="room-filter-panel"
            aria-label={activeFilterCount > 0 ? `Filter, ${activeFilterCount} active` : 'Filter'}
          >
            <Filter size={16} aria-hidden="true" />
            <span style={{ marginLeft: '8px' }}>Filter</span>
            {activeFilterCount > 0 && (
              <span className="res-filterbtn-count" aria-hidden="true">{activeFilterCount}</span>
            )}
          </Button>

          {filterOpen && (
            <>
              <button
                type="button"
                className="res-filter-scrim"
                aria-label="Close filters"
                onClick={closeFilter}
                tabIndex={-1}
              />
              <div className={`res-cascade${activeCategory ? ' res-cascade--split res-cascade--detail' : ''}`}>
                <div className="res-cascade__panel1" role="dialog" aria-label="Room filters">
                  <div className="res-cascade__head">
                    <h2 className="res-cascade__title">Filter</h2>
                    <button
                      type="button"
                      onClick={closeFilter}
                      aria-label="Close filters"
                      className="res-cascade__close"
                    >
                      <X size={18} aria-hidden="true" />
                    </button>
                  </div>
                  <ul className="res-cascade__cats">
                    {FILTER_CATEGORIES.map((cat) => {
                      const active = draft[cat.key] !== 'all';
                      const selected = activeCategory === cat.key;
                      return (
                        <li key={cat.key}>
                          <button
                            type="button"
                            className={`res-cascade__catbtn${active ? ' res-cascade__catbtn--active' : ''}`}
                            aria-expanded={selected}
                            onClick={() => setActiveCategory(selected ? null : cat.key)}
                          >
                            <span className="res-cascade__catlabel">{cat.label}</span>
                            {active && (
                              <span className="res-cascade__catsub">
                                {cat.options.find((o) => o.value === draft[cat.key])?.label}
                              </span>
                            )}
                            <span className="res-cascade__chev" aria-hidden="true">
                              <ChevronRight size={16} aria-hidden="true" />
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="res-cascade__actions">
                    <Button variant="outline" onClick={resetFilters}>Reset</Button>
                    <Button onClick={applyFilters}>Apply</Button>
                  </div>
                </div>

                {activeCategory && (
                  <div className="res-cascade__panel2" aria-label={`${FILTER_CATEGORIES.find((c) => c.key === activeCategory)?.label} options`}>
                    <div className="res-cascade__head">
                      <button
                        type="button"
                        onClick={() => setActiveCategory(null)}
                        aria-label="Back to filter categories"
                        className="res-cascade__back"
                      >
                        <ChevronLeft size={18} aria-hidden="true" />
                        {FILTER_CATEGORIES.find((c) => c.key === activeCategory)?.label}
                      </button>
                      <h3 className="res-cascade__title">{FILTER_CATEGORIES.find((c) => c.key === activeCategory)?.label}</h3>
                      <button
                        type="button"
                        onClick={closeFilter}
                        aria-label="Close filters"
                        className="res-cascade__close"
                      >
                        <X size={18} aria-hidden="true" />
                      </button>
                    </div>
                    <ul className="res-cascade__opts">
                      {FILTER_CATEGORIES.find((c) => c.key === activeCategory)?.options.map((opt) => {
                        const selected = draft[activeCategory] === opt.value;
                        return (
                          <li key={opt.value}>
                            <button
                              type="button"
                              className="res-cascade__optbtn"
                              aria-pressed={selected}
                              onClick={() => setDraft({ ...draft, [activeCategory]: opt.value })}
                            >
                              <span className="res-cascade__optlabel">{opt.label}</span>
                              {selected && (
                                <span className="res-cascade__check" aria-hidden="true">
                                  <Check size={16} aria-hidden="true" />
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="res-cascade__actions2">
                      <Button variant="outline" onClick={resetFilters}>Reset</Button>
                      <Button onClick={applyFilters}>Apply</Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div className="res-toolbar__search" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Input
            placeholder="Search room number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search rooms"
          />
          <span style={{ fontSize: '14px', color: '#6B7881', whiteSpace: 'nowrap' }}>
            {filteredRooms.length} rooms
          </span>
        </div>
      </div>

      <Table columns={columns} data={filteredRooms} />

      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && (service.delete(deleteConfirm), setDeleteConfirm(null))}
        title="Delete Room"
        message="Are you sure you want to delete this room?"
        confirmText="Delete"
        destructive
      />

      <Modal
        open={modal !== null}
        onClose={closeModal}
        title={modal?.mode === 'edit' ? 'Edit Room' : 'New Room'}
        size="lg"
      >
        {modal !== null && (
          <RoomForm
            key={modal.mode === 'edit' ? modal.id : 'new'}
            id={modal.mode === 'edit' ? modal.id : undefined}
            onSuccess={closeModal}
            onCancel={closeModal}
          />
        )}
      </Modal>
    </div>
  );
}
