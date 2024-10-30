import React, { useEffect, useState } from "react";
const { __ } = wp.i18n;

function ZoomAccountReports({ accountReportData }) {
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 10;

    useEffect(() => {
        setLoading(false);
    }, [accountReportData]);

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const getSortedData = () => {
        if (!Array.isArray(accountReportData)) {
            return [];
        }

        const sortedData = [...accountReportData].sort((a, b) => {
            const aValue = getSortableValue(a, sortBy);
            const bValue = getSortableValue(b, sortBy);

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return sortedData;
    };

    const getSortableValue = (item, column) => {
        switch (column) {
            case 'email':
                return item.email;
            case 'meetings':
                return item.meetings;
            case 'participants':
                return item.participants;
            case 'meeting_minutes':
                return item.meeting_minutes;
            case 'last_login_time':
                return new Date(item.last_login_time).getTime();
            default:
                return '';
        }
    };

    const filteredData = getSortedData().filter(item =>
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meetings.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.participants.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meeting_minutes.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.last_login_time.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) {
            return;
        }
        setCurrentPage(page);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    return (
        <div id="meeting_hub">
            <div className="mhub-common-dashboard">
                <div className="mhub-table-wrapper">
                    {accountReportData.length ? (
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder={__('Search', 'meetinghub')}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="search-input"
                            />
                        </div>
                    ) : ''}

                    <div className={`${accountReportData.length ? 'mhub-has-data-lists' : 'mhub-has-no-data'}`}>
                        {accountReportData.length ? (
                            <div className="table-container">
                                <table className="meeting-hub-table">
                                    <thead>
                                        <tr>
                                            <th onClick={() => handleSort('email')} className={sortBy === 'email' ? `sortable ${sortOrder}` : 'sortable'}>Email</th>
                                            <th onClick={() => handleSort('meetings')} className={sortBy === 'meetings' ? `sortable ${sortOrder}` : 'sortable'}>{__('Meetings Held', 'meetinghub')}</th>
                                            <th onClick={() => handleSort('participants')} className={sortBy === 'participants' ? `sortable ${sortOrder}` : 'sortable'}>{__('Total Participants', 'meetinghub')}</th>
                                            <th onClick={() => handleSort('meeting_minutes')} className={sortBy === 'meeting_minutes' ? `sortable ${sortOrder}` : 'sortable'}>{__('Total Meeting Minutes', 'meetinghub')}</th>
                                            <th onClick={() => handleSort('last_login_time')} className={sortBy === 'last_login_time' ? `sortable ${sortOrder}` : 'sortable'}>{__('Last Login Time', 'meetinghub')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.email}</td>
                                                <td>{item.meetings > 0 ? <strong style={{ color: '#4300FF', fontSize: '16px' }}>{item.meetings}</strong> : '-'}</td>
                                                <td>{item.participants > 0 ? <strong style={{ color: '#00A1B5', fontSize: '16px' }}>{item.participants}</strong> : '-'}</td>
                                                <td>{item.meeting_minutes > 0 ? <strong style={{ color: 'red', fontSize: '16px' }}>{item.meeting_minutes}</strong> : '-'}</td>
                                                <td>{new Date(item.last_login_time).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-user-wrapper">
                                <h1>{__('No report data found', 'meetinghub')}</h1>
                            </div>
                        )}
                    </div>

                    {!filteredData.length && accountReportData.length ? (
                        <div className="empty-meeting-wrapper">
                            <p>{__('No matching records found', 'meetinghub')}</p>
                        </div>
                    ) : ''}

                    {accountReportData.length > itemsPerPage && (
                        <div className="pagination">
                            <span
                                className={`page-link ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                &lt; {__('Previous', 'meetinghub')}
                            </span>
                            {[...Array(totalPages).keys()].map((page) => (
                                <span
                                    key={page + 1}
                                    className={`page-link ${currentPage === page + 1 ? 'active' : ''}`}
                                    onClick={() => handlePageChange(page + 1)}
                                >
                                    {page + 1}
                                </span>
                            ))}
                            <span
                                className={`page-link ${currentPage === totalPages ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                {__('Next', 'meetinghub')} &gt;
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ZoomAccountReports;
