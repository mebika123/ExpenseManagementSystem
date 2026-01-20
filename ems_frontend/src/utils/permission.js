export const can = (permission, permissions = []) => {
    return permissions.includes(permission);
};
export const canAny = (permissionList = [], permissions = []) => {
    return permissionList.some(permission =>
        permissions.includes(permission)
    );
}