import React, { useEffect, useState } from "react";
import Spinner from "../common/Spinner";
const { __ } = wp.i18n;

function ZoomRecordings({ recordingsData }) {
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecordingFiles, setSelectedRecordingFiles] = useState({});
    const itemsPerPage = 10;

    useEffect(() => {
        setLoading(false);
    }, [recordingsData]);

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const getSortedData = () => {
        if (!Array.isArray(recordingsData)) {
            return [];
        }

        const sortedData = [...recordingsData].sort((a, b) => {
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
            case 'meeting_id':
                return item.id;
            case 'topic':
                return item.topic;
            case 'duration':
                return item.duration;
            case 'recorded':
                return new Date(item.start_time).getTime();
            case 'size':
                return item.total_size;
            default:
                return '';
        }
    };

    const filteredData = getSortedData().filter(item =>
        item.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.duration.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.total_size.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        new Date(item.start_time).toLocaleString().toLowerCase().includes(searchQuery.toLowerCase())
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

    const handleViewRecordings = async (meetingId) => {
        if (!selectedRecordingFiles[meetingId]) {
            try {
                const response = await wp.apiFetch({
                    path: `meetinghub/v2/zoom/meeting_recordings?meeting_id=${meetingId}`,
                    method: 'GET',
                });
    
               if ( response  && response.hasOwnProperty('recording_files') ) {
                    setSelectedRecordingFiles(prevState => ({
                        ...prevState,
                        [meetingId]: response.recording_files || []
                    }));
               }
    
            } catch (error) {
                setErrorMessage(__('An error occurred while fetching recordings.', 'meetinghub'));
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div id="meeting_hub">
            <div className="mhub-common-dashboard">
                <div className="mhub-table-wrapper">
                    {recordingsData.length ? (
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

                    <div className={`${recordingsData.length ? 'mhub-has-data-lists' : 'mhub-has-no-data'}`}>
                        {recordingsData.length ? (
                            <div className="table-container">
                                <table className="meeting-hub-table">
                                    <thead>
                                        <tr>
                                            <th onClick={() => handleSort('meeting_id')} className={sortBy === 'meeting_id' ? `sortable ${sortOrder}` : 'sortable'}>{__('Meeting ID', 'meetinghub')}
                                            </th>
                                            <th onClick={() => handleSort('topic')} className={sortBy === 'topic' ? `sortable ${sortOrder}` : 'sortable'}>{__('Topic', 'meetinghub')}
                                            </th>
                                            <th onClick={() => handleSort('duration')} className={sortBy === 'duration' ? `sortable ${sortOrder}` : 'sortable'}>{__('Duration', 'meetinghub')}
                                            </th>
                                            <th onClick={() => handleSort('recorded')} className={sortBy === 'recorded' ? `sortable ${sortOrder}` : 'sortable'}>{__('Recorded', 'meetinghub')}
                                            </th>
                                            <th onClick={() => handleSort('size')} className={sortBy === 'size' ? `sortable ${sortOrder}` : 'sortable'}>{__('Size', 'meetinghub')}
                                            </th>
                                            <th>  {__('Action', 'meetinghub')} </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.id}</td>
                                                <td>{item.topic}</td>
                                                <td>{item.duration}</td>
                                                <td>{new Date(item.start_time).toLocaleString()}</td>
                                                <td>{item.total_size}</td>
                                                <td>
                                                    <a
                                                        href={`#recording-${index}`}
                                                        onClick={() => handleViewRecordings(item.uuid)}
                                                        className="thickbox"
                                                    >
                                                       {__('View Recordings', 'meetinghub')}

                                                    </a>
                                                    <div id={`recording-${index}`} style={{ display: selectedRecordingFiles[item.uuid] ? 'block' : 'none' }}>
                                                        {selectedRecordingFiles[item.uuid] && selectedRecordingFiles[item.uuid].length > 0 ? (
                                                            selectedRecordingFiles[item.uuid].map((file, fileIndex) => (
                                                                <ul key={file.id}>
                                                                    <li><strong>{__('File Type:', 'meetinghub')}</strong> {file.file_type}</li>
                                                                    <li><strong>{__('File Size:', 'meetinghub')}</strong> {file.file_size}</li>
                                                                    <li><strong>{__('Play:', 'meetinghub')}</strong> <a href={file.play_url} target="_blank" rel="noopener noreferrer">{__('Play', 'meetinghub')}</a></li>
                                                                    <li><strong>{__('Download:', 'meetinghub')}</strong> <a href={file.download_url} target="_blank" rel="noopener noreferrer">{__('Download', 'meetinghub')}</a></li>
                                                                </ul>
                                                            ))
                                                        ) : (
                                                            <p>{__('No recordings available', 'meetinghub')}</p>
                                                        )}
                                                    </div>
                                                </td>
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

                    {!filteredData.length && recordingsData.length ? (
                        <div className="empty-meeting-wrapper">
                           <p>{__('No matching records found', 'meetinghub')}</p>
                        </div>
                    ) : ''}

                    {recordingsData.length > itemsPerPage && (
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

export default ZoomRecordings;
