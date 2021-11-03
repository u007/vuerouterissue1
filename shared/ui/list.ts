
export const dateColumns = () => {
  return [
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      slots: { customRender: 'date' }
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      slots: { customRender: 'date' }
    },
  ]
}